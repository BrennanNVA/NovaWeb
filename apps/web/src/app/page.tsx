import Link from "next/link"

import { SearchBar } from "@/components/search-bar"
import { getPublishedArticles } from "@/lib/articles"
import { TrendingUp, Newspaper, BarChart3 } from "lucide-react"

export default async function HomePage() {
  const { articles } = await getPublishedArticles({ limit: 3 })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-8 shadow-lg sm:p-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7 text-[#0A9D8F]" aria-hidden="true" />
            <p className="text-sm font-medium text-[#0A9D8F]">
              AI-Powered Financial Intelligence
            </p>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#ededed] sm:text-5xl">
            Real-time market insights and AI-generated financial news
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#ededed]/80">
            Nova Aetus delivers autonomous financial news coverage, quantitative research, and market analysis—powered by AI, free to access.
          </p>
          <div className="mt-8">
            <SearchBar className="max-w-2xl" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A9D8F] px-5 py-3 text-sm font-medium text-[#111111] hover:bg-[#0A9D8F]/90 transition-colors"
              aria-label="Read latest news"
            >
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Latest News
            </Link>
            <Link
              href="/markets"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#3a3a3a] bg-transparent px-5 py-3 text-sm font-medium text-[#ededed] hover:bg-[#333333] transition-colors"
              aria-label="View market data"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              Markets
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-6 shadow-sm hover:border-[#0A9D8F]/50 transition-colors">
          <Newspaper className="h-6 w-6 text-[#0A9D8F]" aria-hidden="true" />
          <h3 className="mt-4 text-base font-semibold text-[#ededed]">
            AI-Generated News
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#ededed]/70">
            Autonomous coverage of market-moving events across 50+ tickers, updated daily.
          </p>
        </div>
        <div className="rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-6 shadow-sm hover:border-[#0A9D8F]/50 transition-colors">
          <BarChart3 className="h-6 w-6 text-[#0A9D8F]" aria-hidden="true" />
          <h3 className="mt-4 text-base font-semibold text-[#ededed]">
            Market Analysis
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#ededed]/70">
            Real-time data and quantitative insights powered by advanced analytics.
          </p>
        </div>
        <div className="rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-6 shadow-sm hover:border-[#0A9D8F]/50 transition-colors">
          <TrendingUp className="h-6 w-6 text-[#0A9D8F]" aria-hidden="true" />
          <h3 className="mt-4 text-base font-semibold text-[#ededed]">
            Research & Datasets
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#ededed]/70">
            Open-source financial datasets and reproducible research artifacts.
          </p>
        </div>
      </section>

      {/* Latest News */}
      <section className="mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#ededed]">
              Latest Financial News
            </h2>
            <p className="mt-1 text-sm text-[#ededed]/60">
              AI-generated insights on market-moving events
            </p>
          </div>
          <Link
            href="/news"
            className="text-sm font-medium text-[#0A9D8F] hover:text-[#0A9D8F]/80 transition-colors"
            aria-label="View all news articles"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="block rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-6 shadow-sm transition hover:border-[#0A9D8F]/50 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  {article.tickers.length > 0 && (
                    <span className="rounded-full bg-[#0A9D8F]/20 px-2 py-1 text-xs font-medium text-[#0A9D8F]">
                      {article.tickers[0]}
                    </span>
                  )}
                  {article.is_breaking && (
                    <span className="rounded-full bg-[#E9B44C]/20 px-2 py-1 text-xs font-medium text-[#E9B44C]">
                      Breaking
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-semibold text-[#ededed] line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-2 text-sm leading-6 text-[#ededed]/70 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-4 text-xs text-[#ededed]/50">
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-8 text-center">
              <p className="text-sm text-[#ededed]/60">No articles published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
