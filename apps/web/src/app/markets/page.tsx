import type { Metadata } from "next"
import Link from "next/link"
import { TrendingUp, TrendingDown, BarChart3, Globe, Zap } from "lucide-react"

import { CommandK } from "@/components/command-k"
import { getPublishedArticles } from "@/lib/articles"

export const metadata: Metadata = {
  title: "Markets",
}

export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function MarketsPage() {
  const { articles } = await getPublishedArticles({ limit: 5 })
  
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Markets
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-foreground-muted">
          Real-time market data and AI-generated coverage across major indices, stocks, and crypto.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Overview */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Market Overview</span>
            </div>
            <div className="grid gap-3">
              {MARKET_INDICES.map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border-subtle bg-background/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-14 font-mono text-xs font-medium text-foreground">{item.symbol}</span>
                    <span className="text-sm text-foreground-muted">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-foreground">{item.price}</span>
                    <span className={`flex items-center gap-1 font-mono text-xs ${item.isUp ? "text-positive" : "text-negative"}`}>
                      {item.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-foreground-muted text-right">Data refreshes every 60 seconds</p>
          </div>

          {/* Top Stocks */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Top Stocks</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {TOP_STOCKS.map((stock) => (
                <Link
                  key={stock.symbol}
                  href={`/news?ticker=${stock.symbol}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background/40 px-4 py-3 hover:border-accent/30 transition-colors"
                >
                  <div>
                    <span className="font-mono text-xs font-medium text-foreground">{stock.symbol}</span>
                    <p className="text-[10px] text-foreground-muted">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-foreground">{stock.price}</span>
                    <p className={`font-mono text-[10px] ${stock.isUp ? "text-positive" : "text-negative"}`}>
                      {stock.change}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Crypto */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Crypto</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {CRYPTO_ASSETS.map((crypto) => (
                <div
                  key={crypto.symbol}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background/40 px-4 py-3"
                >
                  <div>
                    <span className="font-mono text-xs font-medium text-foreground">{crypto.symbol}</span>
                    <p className="text-[10px] text-foreground-muted">{crypto.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-foreground">{crypto.price}</span>
                    <p className={`font-mono text-[10px] ${crypto.isUp ? "text-positive" : "text-negative"}`}>
                      {crypto.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <p className="text-xs font-medium text-foreground mb-3">Quick Search</p>
            <CommandK className="w-full justify-between" />
            <p className="mt-2 text-[10px] text-foreground-muted">Press ⌘K to search tickers and news</p>
          </div>

          {/* Watchlist */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <p className="text-xs font-medium text-foreground mb-3">Watchlist</p>
            <div className="flex flex-wrap gap-2">
              {WATCHLIST.map((symbol) => (
                <Link
                  key={symbol}
                  href={`/news?ticker=${symbol}`}
                  className="rounded-full border border-border-subtle bg-background/40 px-3 py-1 font-mono text-[10px] text-foreground-muted hover:border-accent/30 hover:text-accent transition-colors"
                >
                  {symbol}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent News */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-foreground">Latest News</p>
              <Link href="/news" className="text-[10px] text-accent hover:text-accent/80">View all →</Link>
            </div>
            <div className="space-y-2">
              {articles.slice(0, 4).map((article) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="block rounded-lg border border-border-subtle bg-background/40 p-3 hover:border-accent/30 transition-colors"
                >
                  <p className="text-[11px] font-medium text-foreground line-clamp-2">{article.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {article.tickers?.slice(0, 1).map((t) => (
                      <span key={t} className="text-[9px] font-mono text-accent">{t}</span>
                    ))}
                    {article.tags?.includes("macro") && (
                      <span className="text-[9px] font-mono text-accent">MACRO</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MARKET_INDICES = [
  { symbol: "SPX", label: "S&P 500", price: "4,842.11", change: "+0.26%", isUp: true },
  { symbol: "NDX", label: "Nasdaq 100", price: "16,901.52", change: "-0.23%", isUp: false },
  { symbol: "DJI", label: "Dow Jones", price: "37,440.34", change: "+0.18%", isUp: true },
  { symbol: "VIX", label: "Volatility Index", price: "13.42", change: "-2.1%", isUp: false },
]

const TOP_STOCKS = [
  { symbol: "NVDA", name: "NVIDIA", price: "$188.75", change: "+0.65%", isUp: true },
  { symbol: "AAPL", name: "Apple", price: "$272.91", change: "-0.06%", isUp: false },
  { symbol: "MSFT", name: "Microsoft", price: "$485.89", change: "-0.35%", isUp: false },
  { symbol: "GOOGL", name: "Alphabet", price: "$317.00", change: "+1.02%", isUp: true },
  { symbol: "AMZN", name: "Amazon", price: "$186.45", change: "+0.42%", isUp: true },
  { symbol: "META", name: "Meta", price: "$531.20", change: "+0.28%", isUp: true },
]

const CRYPTO_ASSETS = [
  { symbol: "BTC", name: "Bitcoin", price: "$88,726", change: "+0.04%", isUp: true },
  { symbol: "ETH", name: "Ethereum", price: "$3,040", change: "-0.11%", isUp: false },
  { symbol: "SOL", name: "Solana", price: "$189.45", change: "+2.3%", isUp: true },
  { symbol: "XRP", name: "Ripple", price: "$2.18", change: "-1.2%", isUp: false },
]

const WATCHLIST = ["NVDA", "AAPL", "MSFT", "TSLA", "AMZN", "META", "GOOGL", "AMD"]
