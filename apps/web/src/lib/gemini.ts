import "server-only"

import { GoogleGenerativeAI } from "@google/generative-ai"

import type { MarketSnapshot } from "@/lib/alpaca"
import type { StockScore } from "@/lib/stock-score"
import type { WorldNewsArticle } from "@/lib/newsapi"

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
  stockScore?: StockScore
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
  
  // Temporarily disabled stock score calculation until database column is added
  // const stockScore = calculateStockScore(snapshot)
  // const scoreContext = `Rating: ${stockScore.overall.toUpperCase()} (Score: ${stockScore.score}/100, Confidence: ${stockScore.confidence})`
  const scoreContext = "Rating: HOLD (Score: 50/100, Confidence: Medium)"

  const prompt = `You are a professional financial journalist writing for Nova Aetus, a fintech news platform. Write a ${articleType} article about ${symbol}.

## Market Data
${priceContext}

## Nova Aetus Rating
${scoreContext}
Key signals: Price momentum: NEUTRAL, Volume: NORMAL, Volatility: LOW

## Recent News Headlines
${newsContext || "No recent news available"}

## Instructions
1. Write a comprehensive, professional article about ${symbol}'s current market situation
2. Include detailed analysis of the price movement, trading volume, and any relevant news
3. Reference the Nova Aetus rating and explain what it means for different types of investors
4. Keep the tone professional but accessible to retail investors
5. Article should be 800-1200 words - be thorough and detailed
6. Use markdown formatting with headers (##), bullet points, and bold text where appropriate
7. Do NOT include the title in the body - just the content
8. Include these sections:
   - Market Overview (current price action and context)
   - Recent Developments (news and catalysts)
   - Technical Analysis (support/resistance, trends)
   - Fundamental Outlook (valuation, growth prospects)
   - What to Watch (upcoming events, key levels)
   - Investment Considerations (risks and opportunities)
9. Focus on actionable insights and data-driven analysis

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

  // Temporarily disabled stock score card until database column is added
  // const scoreCard = formatScoreForArticle(stockScore)
  const fullBody = parsed.body || text

  return {
    title: parsed.title || `${symbol} Market Update`,
    excerpt: parsed.excerpt || `Market analysis for ${symbol}.`,
    bodyMarkdown: fullBody,
    tags: parsed.tags || ["market-update"],
    model: "gemini-2.0-flash",
    promptVersion: "v2-temp",
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
1. Write a comprehensive macro analysis article about current ${topicInfo.name.toLowerCase()} trends
2. Include relevant data points, recent developments, and market implications
3. Keep the tone professional but accessible to retail investors
4. Article should be 800-1200 words - be thorough and detailed
5. Use markdown formatting with headers (##), bullet points, and bold text where appropriate
6. Do NOT include the title in the body - just the content
7. Include these sections:
   - Current Situation (what's happening now)
   - Key Data Points (relevant statistics and metrics)
   - Market Impact (how this affects stocks, bonds, sectors)
   - Historical Context (how this compares to past events)
   - Expert Perspectives (what analysts are saying)
   - What to Watch (upcoming events, key indicators)
   - Investment Implications (actionable takeaways)
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

export async function generateWorldNewsArticle({
  newsItems,
}: {
  newsItems: WorldNewsArticle[]
}): Promise<GeneratedArticle> {
  const client = getGeminiClient()
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" })

  const today = new Date().toISOString().slice(0, 10)
  
  const newsContext = newsItems
    .slice(0, 5)
    .map((n, i) => `${i + 1}. "${n.title}" (${n.source}) - ${n.description || "No description"}`)
    .join("\n")

  const prompt = `You are a professional financial journalist writing for Nova Aetus, a fintech news platform. Write a comprehensive breaking news article based on the following top headlines.

## Today's Date
${today}

## Top Headlines
${newsContext}

## Instructions
1. Write a comprehensive news analysis article covering the most important story from the headlines
2. Focus on the story with the biggest market or geopolitical impact
3. Provide context, background, and analysis of implications
4. Keep the tone professional but accessible
5. Article should be 800-1200 words - be thorough and detailed
6. Use markdown formatting with headers (##), bullet points, and bold text where appropriate
7. Do NOT include the title in the body - just the content
8. Include these sections:
   - Breaking Development (what just happened)
   - Background & Context (why this matters)
   - Key Details (important facts and figures)
   - Market Implications (how this affects investors)
   - Expert Analysis (perspectives on the situation)
   - What Happens Next (upcoming developments to watch)
9. If the story involves geopolitics, military, or government actions, explain the broader implications

## Output Format
Return ONLY a JSON object with this exact structure (no markdown code blocks):
{
  "title": "Compelling breaking news headline",
  "excerpt": "A 1-2 sentence summary for the article card",
  "body": "The full article body in markdown format",
  "tags": ["breaking-news", "relevant-category", "additional-tags"]
}

Make the title urgent and newsworthy. This is breaking news.`

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
      title: "Breaking News Update",
      excerpt: "Latest breaking news and developments.",
      body: text,
      tags: ["breaking-news"],
    }
  }

  return {
    title: parsed.title || "Breaking News Update",
    excerpt: parsed.excerpt || "Latest breaking news and developments.",
    bodyMarkdown: parsed.body || text,
    tags: parsed.tags || ["breaking-news"],
    model: "gemini-2.0-flash",
    promptVersion: "v1-world-news",
  }
}
