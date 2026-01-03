import "server-only"

import type { MarketSnapshot } from "@/lib/alpaca"

export interface StockScore {
  overall: "buy" | "hold" | "sell"
  score: number // -100 to 100
  confidence: "low" | "medium" | "high"
  signals: SignalResult[]
  summary: string
}

export interface SignalResult {
  name: string
  signal: "bullish" | "neutral" | "bearish"
  weight: number
  description: string
}

export function calculateStockScore(snapshot: MarketSnapshot): StockScore {
  const signals: SignalResult[] = []
  
  // 1. Price Momentum Signal
  const momentum = analyzeMomentum(snapshot)
  signals.push(momentum)
  
  // 2. Volume Signal
  const volume = analyzeVolume(snapshot)
  signals.push(volume)
  
  // 3. News Sentiment Signal
  const sentiment = analyzeNewsSentiment(snapshot)
  signals.push(sentiment)
  
  // 4. Price Range Signal (volatility)
  const range = analyzePriceRange(snapshot)
  signals.push(range)
  
  // 5. Trend Signal
  const trend = analyzeTrend(snapshot)
  signals.push(trend)
  
  // Calculate weighted score
  let totalWeight = 0
  let weightedScore = 0
  
  for (const signal of signals) {
    const signalScore = signal.signal === "bullish" ? 1 : signal.signal === "bearish" ? -1 : 0
    weightedScore += signalScore * signal.weight
    totalWeight += signal.weight
  }
  
  const normalizedScore = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0
  
  // Determine overall rating
  let overall: "buy" | "hold" | "sell"
  if (normalizedScore >= 30) {
    overall = "buy"
  } else if (normalizedScore <= -30) {
    overall = "sell"
  } else {
    overall = "hold"
  }
  
  // Determine confidence based on signal agreement
  const bullishCount = signals.filter(s => s.signal === "bullish").length
  const bearishCount = signals.filter(s => s.signal === "bearish").length
  const neutralCount = signals.filter(s => s.signal === "neutral").length
  
  let confidence: "low" | "medium" | "high"
  if (bullishCount >= 4 || bearishCount >= 4) {
    confidence = "high"
  } else if (bullishCount >= 3 || bearishCount >= 3) {
    confidence = "medium"
  } else {
    confidence = "low"
  }
  
  // Generate summary
  const summary = generateScoreSummary(overall, normalizedScore, confidence, signals)
  
  return {
    overall,
    score: normalizedScore,
    confidence,
    signals,
    summary,
  }
}

function analyzeMomentum(snapshot: MarketSnapshot): SignalResult {
  const changePercent = snapshot.changePercent ?? 0
  
  let signal: "bullish" | "neutral" | "bearish"
  let description: string
  
  if (changePercent > 2) {
    signal = "bullish"
    description = `Strong upward momentum (+${changePercent.toFixed(2)}%)`
  } else if (changePercent > 0.5) {
    signal = "bullish"
    description = `Positive momentum (+${changePercent.toFixed(2)}%)`
  } else if (changePercent < -2) {
    signal = "bearish"
    description = `Strong downward pressure (${changePercent.toFixed(2)}%)`
  } else if (changePercent < -0.5) {
    signal = "bearish"
    description = `Negative momentum (${changePercent.toFixed(2)}%)`
  } else {
    signal = "neutral"
    description = `Flat price action (${changePercent.toFixed(2)}%)`
  }
  
  return {
    name: "Price Momentum",
    signal,
    weight: 25,
    description,
  }
}

function analyzeVolume(snapshot: MarketSnapshot): SignalResult {
  const bar = snapshot.latestBar
  
  if (!bar) {
    return {
      name: "Volume",
      signal: "neutral",
      weight: 20,
      description: "Volume data unavailable",
    }
  }
  
  // Compare current volume to typical (we'd need historical data for accurate comparison)
  // For now, use absolute thresholds based on price movement correlation
  const priceChange = snapshot.changePercent ?? 0
  const volumeHigh = bar.v > 1000000
  
  let signal: "bullish" | "neutral" | "bearish"
  let description: string
  
  if (volumeHigh && priceChange > 0) {
    signal = "bullish"
    description = "High volume supporting price increase"
  } else if (volumeHigh && priceChange < 0) {
    signal = "bearish"
    description = "High volume on price decline"
  } else if (!volumeHigh && Math.abs(priceChange) > 1) {
    signal = "neutral"
    description = "Price move on low volume - caution advised"
  } else {
    signal = "neutral"
    description = "Normal trading volume"
  }
  
  return {
    name: "Volume Analysis",
    signal,
    weight: 20,
    description,
  }
}

function analyzeNewsSentiment(snapshot: MarketSnapshot): SignalResult {
  const news = snapshot.news
  
  if (!news || news.length === 0) {
    return {
      name: "News Sentiment",
      signal: "neutral",
      weight: 25,
      description: "No recent news to analyze",
    }
  }
  
  // Simple keyword-based sentiment analysis
  const positiveKeywords = ["surge", "gain", "rise", "beat", "exceed", "growth", "profit", "upgrade", "bullish", "strong", "record", "breakthrough"]
  const negativeKeywords = ["fall", "drop", "decline", "miss", "loss", "downgrade", "bearish", "weak", "concern", "risk", "warning", "lawsuit"]
  
  let positiveCount = 0
  let negativeCount = 0
  
  for (const item of news) {
    const text = `${item.headline} ${item.summary ?? ""}`.toLowerCase()
    
    for (const keyword of positiveKeywords) {
      if (text.includes(keyword)) positiveCount++
    }
    for (const keyword of negativeKeywords) {
      if (text.includes(keyword)) negativeCount++
    }
  }
  
  let signal: "bullish" | "neutral" | "bearish"
  let description: string
  
  if (positiveCount > negativeCount + 2) {
    signal = "bullish"
    description = `Positive news sentiment (${positiveCount} bullish signals)`
  } else if (negativeCount > positiveCount + 2) {
    signal = "bearish"
    description = `Negative news sentiment (${negativeCount} bearish signals)`
  } else {
    signal = "neutral"
    description = "Mixed or neutral news sentiment"
  }
  
  return {
    name: "News Sentiment",
    signal,
    weight: 25,
    description,
  }
}

function analyzePriceRange(snapshot: MarketSnapshot): SignalResult {
  const bar = snapshot.latestBar
  
  if (!bar) {
    return {
      name: "Price Range",
      signal: "neutral",
      weight: 15,
      description: "Price range data unavailable",
    }
  }
  
  const range = bar.h - bar.l
  const rangePercent = (range / bar.l) * 100
  const closePosition = (bar.c - bar.l) / range // 0 = closed at low, 1 = closed at high
  
  let signal: "bullish" | "neutral" | "bearish"
  let description: string
  
  if (closePosition > 0.7) {
    signal = "bullish"
    description = `Closed near session high (${(closePosition * 100).toFixed(0)}% of range)`
  } else if (closePosition < 0.3) {
    signal = "bearish"
    description = `Closed near session low (${(closePosition * 100).toFixed(0)}% of range)`
  } else {
    signal = "neutral"
    description = `Closed mid-range (${(closePosition * 100).toFixed(0)}% of range)`
  }
  
  return {
    name: "Price Range",
    signal,
    weight: 15,
    description,
  }
}

function analyzeTrend(snapshot: MarketSnapshot): SignalResult {
  const bar = snapshot.latestBar
  const changePercent = snapshot.changePercent ?? 0
  
  if (!bar) {
    return {
      name: "Trend",
      signal: "neutral",
      weight: 15,
      description: "Trend data unavailable",
    }
  }
  
  // Simple trend analysis based on open vs close and overall direction
  const openToClose = ((bar.c - bar.o) / bar.o) * 100
  
  let signal: "bullish" | "neutral" | "bearish"
  let description: string
  
  if (openToClose > 1 && changePercent > 0) {
    signal = "bullish"
    description = "Uptrend confirmed - higher close than open"
  } else if (openToClose < -1 && changePercent < 0) {
    signal = "bearish"
    description = "Downtrend confirmed - lower close than open"
  } else if (Math.abs(openToClose) < 0.5) {
    signal = "neutral"
    description = "Consolidation pattern - indecisive"
  } else {
    signal = "neutral"
    description = "Mixed signals in trend direction"
  }
  
  return {
    name: "Trend Analysis",
    signal,
    weight: 15,
    description,
  }
}

function generateScoreSummary(
  overall: "buy" | "hold" | "sell",
  score: number,
  confidence: "low" | "medium" | "high",
  signals: SignalResult[]
): string {
  const bullishSignals = signals.filter(s => s.signal === "bullish").map(s => s.name)
  const bearishSignals = signals.filter(s => s.signal === "bearish").map(s => s.name)
  
  let summary = ""
  
  if (overall === "buy") {
    summary = `**Buy Signal** (Score: +${score}) - `
    if (confidence === "high") {
      summary += "Strong bullish indicators across multiple metrics. "
    } else if (confidence === "medium") {
      summary += "Moderately bullish with some supporting signals. "
    } else {
      summary += "Slight bullish lean but signals are mixed. "
    }
    if (bullishSignals.length > 0) {
      summary += `Positive factors: ${bullishSignals.join(", ")}.`
    }
  } else if (overall === "sell") {
    summary = `**Sell Signal** (Score: ${score}) - `
    if (confidence === "high") {
      summary += "Strong bearish indicators across multiple metrics. "
    } else if (confidence === "medium") {
      summary += "Moderately bearish with concerning signals. "
    } else {
      summary += "Slight bearish lean but signals are mixed. "
    }
    if (bearishSignals.length > 0) {
      summary += `Negative factors: ${bearishSignals.join(", ")}.`
    }
  } else {
    summary = `**Hold Signal** (Score: ${score}) - `
    summary += "Mixed signals suggest waiting for clearer direction. "
    if (bullishSignals.length > 0 && bearishSignals.length > 0) {
      summary += `Bullish: ${bullishSignals.join(", ")}. Bearish: ${bearishSignals.join(", ")}.`
    }
  }
  
  return summary
}

export function formatScoreForArticle(score: StockScore): string {
  const ratingEmoji = score.overall === "buy" ? "🟢" : score.overall === "sell" ? "🔴" : "🟡"
  const confidenceLabel = score.confidence.charAt(0).toUpperCase() + score.confidence.slice(1)
  
  let markdown = `## Nova Aetus Rating\n\n`
  markdown += `| Metric | Value |\n`
  markdown += `|--------|-------|\n`
  markdown += `| **Rating** | ${ratingEmoji} ${score.overall.toUpperCase()} |\n`
  markdown += `| **Score** | ${score.score > 0 ? "+" : ""}${score.score}/100 |\n`
  markdown += `| **Confidence** | ${confidenceLabel} |\n\n`
  
  markdown += `### Signal Breakdown\n\n`
  
  for (const signal of score.signals) {
    const emoji = signal.signal === "bullish" ? "📈" : signal.signal === "bearish" ? "📉" : "➡️"
    markdown += `- **${signal.name}** ${emoji}: ${signal.description}\n`
  }
  
  markdown += `\n### Analysis\n\n${score.summary}\n`
  
  markdown += `\n> ⚠️ *This rating is generated algorithmically based on publicly available market data and should not be considered financial advice. Always conduct your own research before making investment decisions.*\n`
  
  return markdown
}
