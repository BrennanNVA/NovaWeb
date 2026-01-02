import "server-only"

const ALPACA_BASE_URL = "https://data.alpaca.markets"
const ALPACA_NEWS_URL = "https://data.alpaca.markets/v1beta1/news"

interface AlpacaCredentials {
  apiKey: string
  apiSecret: string
}

function getCredentials(): AlpacaCredentials {
  const apiKey = process.env.ALPACA_API_KEY
  const apiSecret = process.env.ALPACA_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error("ALPACA_API_KEY and ALPACA_API_SECRET must be set")
  }

  return { apiKey, apiSecret }
}

export interface AlpacaNewsItem {
  id: number
  headline: string
  summary: string
  author: string
  created_at: string
  updated_at: string
  url: string
  symbols: string[]
  source: string
}

export interface AlpacaBar {
  t: string
  o: number
  h: number
  l: number
  c: number
  v: number
  n: number
  vw: number
}

export interface MarketSnapshot {
  symbol: string
  latestBar: AlpacaBar | null
  previousClose: number | null
  change: number | null
  changePercent: number | null
  news: AlpacaNewsItem[]
  fetchedAt: string
}

export async function fetchTickerNews({
  symbol,
  limit = 5,
}: {
  symbol: string
  limit?: number
}): Promise<AlpacaNewsItem[]> {
  const { apiKey, apiSecret } = getCredentials()

  const params = new URLSearchParams({
    symbols: symbol,
    limit: String(limit),
    sort: "desc",
  })

  const response = await fetch(`${ALPACA_NEWS_URL}?${params}`, {
    headers: {
      "APCA-API-KEY-ID": apiKey,
      "APCA-API-SECRET-KEY": apiSecret,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Alpaca news API error: ${response.status} - ${text}`)
  }

  const data = (await response.json()) as { news: AlpacaNewsItem[] }
  return data.news ?? []
}

export async function fetchLatestBar({
  symbol,
}: {
  symbol: string
}): Promise<AlpacaBar | null> {
  const { apiKey, apiSecret } = getCredentials()

  const url = `${ALPACA_BASE_URL}/v2/stocks/${symbol}/bars/latest`

  const response = await fetch(url, {
    headers: {
      "APCA-API-KEY-ID": apiKey,
      "APCA-API-SECRET-KEY": apiSecret,
    },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    const text = await response.text()
    throw new Error(`Alpaca bars API error: ${response.status} - ${text}`)
  }

  const data = (await response.json()) as { bar: AlpacaBar }
  return data.bar ?? null
}

export async function fetchPreviousClose({
  symbol,
}: {
  symbol: string
}): Promise<number | null> {
  const { apiKey, apiSecret } = getCredentials()

  const now = new Date()
  const end = new Date(now)
  end.setDate(end.getDate() - 1)
  
  const start = new Date(end)
  start.setDate(start.getDate() - 5)

  const params = new URLSearchParams({
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    timeframe: "1Day",
    limit: "1",
    sort: "desc",
  })

  const url = `${ALPACA_BASE_URL}/v2/stocks/${symbol}/bars?${params}`

  const response = await fetch(url, {
    headers: {
      "APCA-API-KEY-ID": apiKey,
      "APCA-API-SECRET-KEY": apiSecret,
    },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    return null
  }

  const data = (await response.json()) as { bars: AlpacaBar[] }
  const bar = data.bars?.[0]
  return bar?.c ?? null
}

export async function fetchMarketSnapshot({
  symbol,
}: {
  symbol: string
}): Promise<MarketSnapshot> {
  const [latestBar, previousClose, news] = await Promise.all([
    fetchLatestBar({ symbol }).catch(() => null),
    fetchPreviousClose({ symbol }).catch(() => null),
    fetchTickerNews({ symbol, limit: 5 }).catch(() => []),
  ])

  let change: number | null = null
  let changePercent: number | null = null

  if (latestBar && previousClose && previousClose !== 0) {
    change = latestBar.c - previousClose
    changePercent = (change / previousClose) * 100
  }

  return {
    symbol,
    latestBar,
    previousClose,
    change,
    changePercent,
    news,
    fetchedAt: new Date().toISOString(),
  }
}
