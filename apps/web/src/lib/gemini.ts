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

export type MacroTopic = "fed-policy" | "inflation" | "employment" | "gdp" | "global-markets" | "commodities" | "crypto-market" | "sector-rotation"

const MACRO_TOPICS: Record<MacroTopic, { name: string; description: string }> = {
  "fed-policy": { name: "Federal Reserve Policy", description: "Interest rates, monetary policy, and Fed communications" },
  "inflation": { name: "Inflation & CPI", description: "Consumer prices, inflation trends, and purchasing power" },
  "employment": { name: "Employment & Jobs", description: "Labor market, unemployment, and wage growth" },
  "gdp": { name: "Economic Growth", description: "GDP, economic indicators, and growth forecasts" },
  "global-markets": { name: "Global Markets", description: "International markets, geopolitics, and trade" },
  "commodities": { name: "Commodities", description: "Oil, gold, agricultural commodities, and raw materials" },
  "crypto-market": { name: "Crypto Markets", description: "Bitcoin, Ethereum, and cryptocurrency trends" },
  "sector-rotation": { name: "Sector Rotation", description: "Market sectors, rotation trends, and sector performance" },
}

export async function generateMacroArticle({
  topic,
}: {
  topic: MacroTopic
}): Promise<GeneratedArticle> {
  const client = getGeminiClient()
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" })

  const topicInfo = MACRO_TOPICS[topic]
  const today = new Date().toISOString().slice(0, 10)

  const prompt = `You are a professional financial journalist writing for Nova Aetus, a fintech news platform. Write a macro analysis article about ${topicInfo.name}.

## Topic
${topicInfo.name}: ${topicInfo.description}

## Date
${today}

## Instructions
1. Write a professional macro analysis article about current ${topicInfo.name.toLowerCase()} trends
2. Include relevant data points, recent developments, and market implications
3. Keep the tone professional but accessible to retail investors
4. Article should be 400-600 words
5. Use markdown formatting with headers (##), bullet points, and bold text where appropriate
6. Do NOT include the title in the body - just the content
7. Focus on actionable insights and what investors should watch
8. Include both short-term and longer-term perspectives

## Output Format
Return ONLY a JSON object with this exact structure (no markdown code blocks):
{
  "title": "Compelling headline about ${topicInfo.name}",
  "excerpt": "A 1-2 sentence summary for the article card",
  "body": "The full article body in markdown format",
  "tags": ["macro", "${topic}", "additional-relevant-tags"]
}

Make the title timely and specific to current market conditions.`

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
      title: `${topicInfo.name} Analysis`,
      excerpt: `Latest analysis on ${topicInfo.name.toLowerCase()}.`,
      body: text,
      tags: ["macro", topic],
    }
  }

  return {
    title: parsed.title || `${topicInfo.name} Analysis`,
    excerpt: parsed.excerpt || `Analysis of ${topicInfo.name.toLowerCase()}.`,
    bodyMarkdown: parsed.body || text,
    tags: parsed.tags || ["macro", topic],
    model: "gemini-2.0-flash",
    promptVersion: "v1-macro",
  }
}

export function getRandomMacroTopic(): MacroTopic {
  const topics = Object.keys(MACRO_TOPICS) as MacroTopic[]
  return topics[Math.floor(Math.random() * topics.length)]
}
