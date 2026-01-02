import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const revalidate = 60


const ALPACA_BASE_URL = "https://data.alpaca.markets"

interface PulseItem {
  symbol: string
  price: string
  change: string
  changePercent: string
  isUp: boolean
}

export async function GET() {
  const apiKey = process.env.ALPACA_API_KEY
  const apiSecret = process.env.ALPACA_API_SECRET

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ items: getDefaultItems() })
  }

  try {
    const items = await fetchPulseData({ apiKey, apiSecret })
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Pulse API error:", error)
    return NextResponse.json({ items: getDefaultItems() })
  }
}

async function fetchPulseData({
  apiKey,
  apiSecret,
}: {
  apiKey: string
  apiSecret: string
}): Promise<PulseItem[]> {
  const stockSymbols = ["NVDA", "AAPL", "MSFT"]
  const cryptoSymbols = ["BTC", "ETH"]
  
  const results: PulseItem[] = []

  const stockParams = new URLSearchParams({
    symbols: stockSymbols.join(","),
  })

  const stockResponse = await fetch(
    `${ALPACA_BASE_URL}/v2/stocks/snapshots?${stockParams}`,
    {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    }
  )

  if (stockResponse.ok) {
    const stockData = (await stockResponse.json()) as Record<string, StockSnapshot>
    
    for (const symbol of stockSymbols) {
      const snapshot = stockData[symbol]
      if (snapshot?.latestTrade && snapshot?.prevDailyBar) {
        const price = snapshot.latestTrade.p
        const prevClose = snapshot.prevDailyBar.c
        const change = price - prevClose
        const changePercent = (change / prevClose) * 100

        results.push({
          symbol,
          price: formatPrice(price),
          change: formatChange(change),
          changePercent: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
          isUp: change >= 0,
        })
      }
    }
  }

  for (const symbol of cryptoSymbols) {
    const cryptoResponse = await fetch(
      `${ALPACA_BASE_URL}/v1beta3/crypto/us/latest/bars?symbols=${symbol}/USD`,
      {
        headers: {
          "APCA-API-KEY-ID": apiKey,
          "APCA-API-SECRET-KEY": apiSecret,
        },
      }
    )

    if (cryptoResponse.ok) {
      const cryptoData = (await cryptoResponse.json()) as { bars: Record<string, CryptoBar> }
      const bar = cryptoData.bars?.[`${symbol}/USD`]
      
      if (bar) {
        const price = bar.c
        const change = bar.c - bar.o
        const changePercent = (change / bar.o) * 100

        results.push({
          symbol,
          price: formatCryptoPrice(price, symbol),
          change: formatChange(change),
          changePercent: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
          isUp: change >= 0,
        })
      }
    }
  }

  results.unshift(
    { symbol: "SPX", price: "4,842.11", change: "+12.44", changePercent: "+0.26%", isUp: true },
    { symbol: "NDX", price: "16,901.52", change: "-38.21", changePercent: "-0.23%", isUp: false }
  )

  results.push(
    { symbol: "DXY", price: "102.44", change: "+0.12", changePercent: "+0.12%", isUp: true },
    { symbol: "UST10Y", price: "4.12%", change: "-2bp", changePercent: "-0.02%", isUp: false }
  )

  return results
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return price.toFixed(2)
}

function formatCryptoPrice(price: number, symbol: string): string {
  if (symbol === "BTC") {
    return Math.round(price).toLocaleString("en-US")
  }
  return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : ""
  if (Math.abs(change) >= 100) {
    return `${sign}${Math.round(change)}`
  }
  return `${sign}${change.toFixed(2)}`
}

function getDefaultItems(): PulseItem[] {
  return [
    { symbol: "SPX", price: "4,842.11", change: "+12.44", changePercent: "+0.26%", isUp: true },
    { symbol: "NDX", price: "16,901.52", change: "-38.21", changePercent: "-0.23%", isUp: false },
    { symbol: "NVDA", price: "498.22", change: "+4.11", changePercent: "+0.83%", isUp: true },
    { symbol: "AAPL", price: "192.07", change: "-0.42", changePercent: "-0.22%", isUp: false },
    { symbol: "MSFT", price: "411.18", change: "+1.09", changePercent: "+0.27%", isUp: true },
    { symbol: "BTC", price: "45,220", change: "+310", changePercent: "+0.69%", isUp: true },
    { symbol: "ETH", price: "2,390", change: "-14", changePercent: "-0.58%", isUp: false },
    { symbol: "DXY", price: "102.44", change: "+0.12", changePercent: "+0.12%", isUp: true },
    { symbol: "UST10Y", price: "4.12%", change: "-2bp", changePercent: "-0.02%", isUp: false },
  ]
}

interface StockSnapshot {
  latestTrade?: { p: number }
  prevDailyBar?: { c: number }
}

interface CryptoBar {
  o: number
  c: number
}
