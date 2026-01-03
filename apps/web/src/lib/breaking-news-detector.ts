import "server-only"

import { fetchMarketSnapshot, type MarketSnapshot } from "@/lib/alpaca"

export interface BreakingNewsEvent {
  symbol: string
  reason: string
  severity: "high" | "medium" | "low"
  priceChange: number
  volumeChange?: number
  detectedAt: string
  marketData: MarketSnapshot
}

export async function detectBreakingNewsEvents(symbols: string[]): Promise<BreakingNewsEvent[]> {
  const events: BreakingNewsEvent[] = []
  
  for (const symbol of symbols) {
    try {
      const snapshot = await fetchMarketSnapshot({ symbol })
      const event = analyzeMarketData(symbol, snapshot)
      
      if (event) {
        events.push(event)
      }
    } catch (error) {
      console.error(`Failed to analyze ${symbol} for breaking news:`, error)
    }
  }
  
  // Sort by severity and price change magnitude
  return events.sort((a, b) => {
    const severityWeight = { high: 3, medium: 2, low: 1 }
    const aWeight = severityWeight[a.severity] * Math.abs(a.priceChange)
    const bWeight = severityWeight[b.severity] * Math.abs(b.priceChange)
    return bWeight - aWeight
  })
}

function analyzeMarketData(symbol: string, snapshot: MarketSnapshot): BreakingNewsEvent | null {
  const changePercent = snapshot.changePercent ?? 0
  const bar = snapshot.latestBar
  
  if (!bar) return null
  
  // Check for significant price movements
  if (Math.abs(changePercent) >= 5) {
    const severity = Math.abs(changePercent) >= 10 ? "high" : 
                    Math.abs(changePercent) >= 7 ? "medium" : "low"
    
    return {
      symbol,
      reason: `${changePercent >= 0 ? "Surged" : "Plunged"} ${Math.abs(changePercent).toFixed(2)}% in recent trading`,
      severity,
      priceChange: changePercent,
      detectedAt: new Date().toISOString(),
      marketData: snapshot
    }
  }
  
  // Check for unusual volume spikes
  const volume = bar.v
  const avgVolume = 1000000 // Placeholder - would need historical data
  const volumeRatio = volume / avgVolume
  
  if (volumeRatio >= 3 && Math.abs(changePercent) >= 2) {
    return {
      symbol,
      reason: `Unusual volume detected (${(volumeRatio).toFixed(1)}x average) with ${Math.abs(changePercent).toFixed(2)}% price movement`,
      severity: volumeRatio >= 5 ? "high" : "medium",
      priceChange: changePercent,
      volumeChange: volumeRatio,
      detectedAt: new Date().toISOString(),
      marketData: snapshot
    }
  }
  
  // Check for gap up/down (opening significantly different from previous close)
  // This would need historical data for accurate comparison
  
  return null
}

export async function getActiveTickersForBreakingNews(): Promise<string[]> {
  // Return top 20 most active tickers for breaking news monitoring
  // In a real implementation, this would be based on trading volume, market cap, or watchlists
  return [
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", 
    "JNJ", "V", "PG", "UNH", "HD", "MA", "BAC", "XOM", "CVX", "PFE",
    "CSCO", "ADBE", "NFLX", "CRM", "KO", "PEP", "TMO"
  ]
}

export function generateBreakingNewsTitle(event: BreakingNewsEvent): string {
  const { symbol, priceChange, reason } = event
  
  if (priceChange >= 5) {
    return `${symbol} Soars ${priceChange.toFixed(2)}% on Heavy Trading`
  } else if (priceChange <= -5) {
    return `${symbol} Plunges ${Math.abs(priceChange).toFixed(2)}% Amid Market Volatility`
  } else {
    return `${symbol} Shows Unusual Activity: ${reason}`
  }
}

export function generateBreakingNewsExcerpt(event: BreakingNewsEvent): string {
  const { symbol, priceChange, severity, reason } = event
  
  if (severity === "high") {
    return `Breaking: ${symbol} experiences significant movement with ${Math.abs(priceChange).toFixed(2)}% change. ${reason}`
  } else {
    return `${symbol} shows notable trading activity. ${reason}`
  }
}
