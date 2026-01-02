import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Analysis",
}

export default function AnalysisPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 border-b border-border pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analysis
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-foreground-muted">
          Institutional-style briefs are coming soon. In the meantime, explore the latest news feed
          and research artifacts.
        </p>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <section className="grid gap-4 lg:col-span-8">
          <div className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <p className="text-xs font-medium text-foreground">Today’s briefing</p>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              Placeholder module for macro drivers, earnings deltas, and risk-on/off headlines.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {BRIEFING_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border-subtle bg-background/40 px-4 py-3"
                >
                  <p className="text-sm font-medium text-foreground">{card.title}</p>
                  <p className="mt-1 text-sm leading-6 text-foreground-muted">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/news"
              className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition hover:border-accent/30"
            >
              <p className="text-xs font-medium text-foreground">News feed</p>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                High-density bento feed with tickers, sentiment, and sparklines.
              </p>
              <p className="mt-4 font-mono text-xs text-accent">/news</p>
            </Link>
            <Link
              href="/research"
              className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition hover:border-accent/30"
            >
              <p className="text-xs font-medium text-foreground">Research</p>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Open datasets, reproducibility artifacts, and embeddable previews.
              </p>
              <p className="mt-4 font-mono text-xs text-accent">/research</p>
            </Link>
          </div>
        </section>

        <aside className="grid gap-4 lg:col-span-4">
          <div className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <p className="text-xs font-medium text-foreground">Planned series</p>
            <div className="mt-4 grid gap-3">
              {PLANNED_SERIES.map((series) => (
                <div
                  key={series.title}
                  className="rounded-2xl border border-border-subtle bg-background/40 px-4 py-3"
                >
                  <p className="text-sm font-medium text-foreground">{series.title}</p>
                  <p className="mt-1 text-sm leading-6 text-foreground-muted">{series.description}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

const BRIEFING_CARDS = [
  {
    title: "Macro",
    description: "Central bank commentary, curve moves, and USD liquidity signals.",
  },
  {
    title: "Earnings",
    description: "Quarterly surprises, guidance revisions, and sector rotation.",
  },
  {
    title: "Quant",
    description: "Factor shifts, systematic positioning, and volatility regimes.",
  },
  {
    title: "Risk",
    description: "Event calendar, tail risks, and portfolio hedging notes.",
  },
]

const PLANNED_SERIES = [
  {
    title: "Ticker briefs",
    description: "Per-name market updates aligned to your tracked universe.",
  },
  {
    title: "Cross-asset",
    description: "Daily cross-asset dashboard with mini charts and allocations.",
  },
  {
    title: "Model notes",
    description: "Reproducible quantitative experiments with downloadable inputs.",
  },
]
