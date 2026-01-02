import type { Metadata } from "next"

import { CommandK } from "@/components/command-k"

export const metadata: Metadata = {
  title: "Markets",
}

export default function MarketsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 border-b border-border pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Markets
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-foreground-muted">
          Live dashboards are coming soon. Use the Pulse bar and Command+K to jump into ticker
          coverage.
        </p>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <section className="grid gap-4 lg:col-span-8">
          <div className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <p className="text-xs font-medium text-foreground">Market snapshot</p>
            <div className="mt-4 grid gap-3">
              {DEFAULT_MARKET_ROWS.map((row) => (
                <div
                  key={row.symbol}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-background/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-12 font-mono text-xs text-foreground">{row.symbol}</span>
                    <span className="text-sm text-foreground-muted">{row.label}</span>
                  </div>
                  <div className="flex items-baseline gap-3 font-mono text-xs">
                    <span className="text-foreground">{row.price}</span>
                    <span className={row.isUp ? "text-positive" : "text-negative"}>
                      {row.change} ({row.changePercent})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <p className="text-xs font-medium text-foreground">Watchlist</p>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Open the command palette and type a ticker to filter the news feed.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {DEFAULT_WATCHLIST.map((symbol) => (
                  <a
                    key={symbol}
                    href={`/news?ticker=${encodeURIComponent(symbol)}`}
                    className="rounded-full border border-border-subtle bg-background/40 px-3 py-1 font-mono text-[11px] text-foreground-muted hover:border-accent/30 hover:text-foreground"
                  >
                    {symbol}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <p className="text-xs font-medium text-foreground">Command+K</p>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Search tickers and published stories instantly.
              </p>
              <CommandK className="mt-4 w-full justify-between" />
            </div>
          </div>
        </section>

        <aside className="grid gap-4 lg:col-span-4">
          <div className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <p className="text-xs font-medium text-foreground">Upcoming modules</p>
            <div className="mt-4 grid gap-3 text-sm text-foreground-muted">
              {UPCOMING_MODULES.map((module) => (
                <div
                  key={module.title}
                  className="rounded-2xl border border-border-subtle bg-background/40 px-4 py-3"
                >
                  <p className="text-sm font-medium text-foreground">{module.title}</p>
                  <p className="mt-1 text-sm leading-6 text-foreground-muted">{module.description}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

const DEFAULT_MARKET_ROWS = [
  { symbol: "SPX", label: "S&P 500", price: "4,842.11", change: "+12.44", changePercent: "+0.26%", isUp: true },
  { symbol: "NDX", label: "Nasdaq 100", price: "16,901.52", change: "-38.21", changePercent: "-0.23%", isUp: false },
  { symbol: "DXY", label: "US Dollar Index", price: "102.44", change: "+0.12", changePercent: "+0.12%", isUp: true },
  { symbol: "UST10Y", label: "US 10Y Yield", price: "4.12%", change: "-2bp", changePercent: "-0.02%", isUp: false },
]

const DEFAULT_WATCHLIST = ["NVDA", "AAPL", "MSFT", "AMZN", "META", "TSLA"]

const UPCOMING_MODULES = [
  {
    title: "Intraday heatmap",
    description: "Sector and factor heatmaps with institutional color grading.",
  },
  {
    title: "Volatility pulse",
    description: "Options-implied volatility snapshots per ticker.",
  },
  {
    title: "Macro terminal",
    description: "Rates, FX, and commodities with sparkline mini-charts.",
  },
]
