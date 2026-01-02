import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getPublishedArticles } from "@/lib/articles"
import { NewsArticleCard } from "@/components/news-article-card"

export default async function HomePage() {
  const { articles } = await getPublishedArticles({ limit: 3 })

  const lead = articles[0] ?? null
  const rest = lead ? articles.slice(1) : []

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section - Elastic Style */}
      <section className="border-b border-border pb-16">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Financial intelligence,
            <br />
            <span className="text-accent">powered by AI</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-foreground-muted">
            Real-time market analysis and autonomous news coverage across 50+ tickers.
            Free, open, and built for traders.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent/90 transition-colors"
            >
              View latest news
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-accent/25 hover:bg-surface transition-colors"
            >
              Explore research
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News - Clean Grid */}
      <section className="mt-16">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-3xl font-semibold text-foreground">
              Latest news
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              AI-generated market coverage
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {lead ? (
            <NewsArticleCard article={lead} size="lg" className="lg:col-span-2" />
          ) : (
            <div className="rounded-3xl border border-border bg-surface/80 p-10 text-center text-sm text-foreground-muted lg:col-span-2">
              No articles published yet. Check back soon.
            </div>
          )}

          <div className="grid gap-4">
            {rest.length ? (
              rest.map((article) => (
                <NewsArticleCard key={article.slug} article={article} size="sm" />
              ))
            ) : (
              <div className="rounded-3xl border border-border bg-surface/80 p-6 text-sm text-foreground-muted">
                Publish a few stories to populate the bento feed.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
