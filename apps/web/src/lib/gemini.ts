import "server-only"

import { GoogleGenerativeAI } from "@google/generative-ai"

import type { MarketSnapshot } from "@/lib/alpaca"

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY must be set")
  }

  return new GoogleGenerativeAI(apiKey)
}

export interface GeneratedArticle {
  title: string
  excerpt: string
  bodyMarkdown: string
  tags: string[]
  model: string
  promptVersion: string
}

export async function generateArticleContent({
  symbol,
  snapshot,
  isBreaking = false,
}: {
  symbol: string
  snapshot: MarketSnapshot
  isBreaking?: boolean
}): Promise<GeneratedArticle> {
  const client = getGeminiClient()
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" })

  const newsContext = snapshot.news
    .slice(0, 3)
    .map((n, i) => `${i + 1}. "${n.headline}" - ${n.summary?.slice(0, 200) ?? "No summary"}`)
    .join("\n")

  const priceContext = snapshot.latestBar
    ? `Current price: $${snapshot.latestBar.c.toFixed(2)}, Change: ${snapshot.changePercent?.toFixed(2) ?? "N/A"}%`
    : "Price data unavailable"

  const articleType = isBreaking ? "breaking news" : "routine market update"

  const prompt = `You are a professional financial journalist writing for Nova Aetus, a fintech news platform. Write a ${articleType} article about ${symbol}.

## Market Data
${priceContext}

## Recent News Headlines
${newsContext || "No recent news available"}

## Instructions
1. Write a professional, informative article about ${symbol}'s current market situation
2. Include analysis of the price movement and any relevant news
3. Keep the tone professional but accessible
4. Article should be 300-500 words
5. Use markdown formatting with headers (##), bullet points, and bold text where appropriate
6. Do NOT include the title in the body - just the content
7. Focus on facts and market analysis, avoid speculation
8. If news is limited, focus on technical analysis and market context

## Output Format
Return ONLY a JSON object with this exact structure (no markdown code blocks):
{
  "title": "Article title here",
  "excerpt": "A 1-2 sentence summary for the article card",
  "body": "The full article body in markdown format",
  "tags": ["tag1", "tag2"]
}

The tags should be relevant categories like "earnings", "tech-sector", "market-analysis", "breaking-news", etc.`

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  let parsed: { title: string; excerpt: string; body: string; tags: string[] }

  try {
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()
    
    parsed = JSON.parse(cleanedText)
  } catch {
    parsed = {
      title: `${symbol} Market Update`,
      excerpt: `Latest market analysis for ${symbol}.`,
      body: text,
      tags: ["market-update"],
    }
  }

  return {
    title: parsed.title || `${symbol} Market Update`,
    excerpt: parsed.excerpt || `Market analysis for ${symbol}.`,
    bodyMarkdown: parsed.body || text,
    tags: parsed.tags || ["market-update"],
    model: "gemini-2.0-flash",
    promptVersion: "v1",
  }
}
