import type { Metadata } from "next"

import { getPublishedArticles } from "@/lib/articles"
import { CommandK } from "@/components/command-k"
import type { ArticleListItem } from "@/lib/articles"
import { NewsArticleCard } from "@/components/news-article-card"

export const metadata: Metadata = {
  title: "News",
}

export const dynamic = "force-dynamic"

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; ticker?: string | string[] }>
}) {
  const resolvedSearchParams = await searchParams
  const query = getFirstSearchParam({ value: resolvedSearchParams.q })
  const ticker = getFirstSearchParam({ value: resolvedSearchParams.ticker })

  const { articles } = await getPublishedArticles({
    limit: 30,
    query: query ?? undefined,
    ticker: ticker ?? undefined,
  })

  const suggestedTickers = getSuggestedTickers({ articles })
  const lead = articles[0] ?? null
  const rest = lead ? articles.slice(1) : []

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-6 border-b border-border pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Financial News
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-foreground-muted">
            AI-generated market updates and breaking coverage across our tracked tickers.
          </p>
        </div>
        {query || ticker ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {ticker ? (
              <a
                href={getClearTickerHref({ query })}
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/80 px-3 py-1 font-mono text-foreground-muted hover:border-accent/30"
              >
                Ticker {ticker}
                <span className="text-foreground-muted/70">×</span>
              </a>
            ) : null}
            {query ? (
              <a
                href={getClearQueryHref({ ticker })}
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/80 px-3 py-1 font-mono text-foreground-muted hover:border-accent/30"
              >
                Query {query}
                <span className="text-foreground-muted/70">×</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <section className="grid gap-4 lg:col-span-8">
          {lead ? (
            <NewsArticleCard article={lead} size="lg" />
          ) : (
            <div className="rounded-3xl border border-border bg-surface/80 p-10 text-center text-sm text-foreground-muted">
              No published articles yet. Check back soon!
            </div>
          )}

          {rest.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {rest.map((article) => (
                <NewsArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : null}
        </section>

        <aside className="grid gap-4 lg:col-span-4">
          <section className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-foreground">Global search</p>
              <span className="font-mono text-[11px] text-foreground-muted">Ctrl/⌘ K</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              Jump to tickers, tags, and the latest stories.
            </p>
            <CommandK className="mt-4 w-full justify-between" />
          </section>

          <section className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <p className="text-xs font-medium text-foreground">Filter feed</p>
            <form action="/news" method="get" className="mt-4 grid gap-3">
              {ticker ? <input type="hidden" name="ticker" value={ticker} /> : null}
              <input
                type="search"
                name="q"
                defaultValue={query ?? ""}
                placeholder="Search published articles…"
                className="w-full rounded-2xl border border-border-subtle bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-background transition hover:bg-accent/90"
              >
                Apply
              </button>
            </form>

            {suggestedTickers.length ? (
              <div className="mt-5">
                <p className="text-xs text-foreground-muted">Tickers</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedTickers.map((symbol) => (
                    <a
                      key={symbol}
                      href={getTickerHref({ symbol, query })}
                      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] transition ${
                        symbol === ticker
                          ? "bg-accent/18 text-accent"
                          : "border border-border-subtle bg-background/40 text-foreground-muted hover:border-accent/30"
                      }`}
                    >
                      {symbol}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  )
}

function getFirstSearchParam({ value }: { value: string | string[] | undefined }) {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function getSuggestedTickers({ articles }: { articles: ArticleListItem[] }) {
  const seen = new Set<string>()
  const tickers: string[] = []

  for (const article of articles) {
    for (const symbol of article.tickers ?? []) {
      if (!symbol) continue
      if (seen.has(symbol)) continue

      tickers.push(symbol)
      seen.add(symbol)

      if (tickers.length >= 10) return tickers
    }
  }

  return tickers
}

function getTickerHref({ symbol, query }: { symbol: string; query: string | null }) {
  const params = new URLSearchParams()
  params.set("ticker", symbol)

  if (query) params.set("q", query)

  return `/news?${params.toString()}`
}

function getClearTickerHref({ query }: { query: string | null }) {
  if (!query) return "/news"

  const params = new URLSearchParams()
  params.set("q", query)

  return `/news?${params.toString()}`
}

function getClearQueryHref({ ticker }: { ticker: string | null }) {
  if (!ticker) return "/news"

  const params = new URLSearchParams()
  params.set("ticker", ticker)

  return `/news?${params.toString()}`
}
