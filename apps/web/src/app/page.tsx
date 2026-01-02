import Link from "next/link"

import { SearchBar } from "@/components/search-bar"
import { getPublishedArticles } from "@/lib/articles"
import { TrendingUp, Newspaper, BarChart3 } from "lucide-react"

export default async function HomePage() {
  const { articles } = await getPublishedArticles({ limit: 3 })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-[#374151] bg-gradient-to-br from-[#1a1f35] via-[#232940] to-[#1a1f35] p-8 shadow-2xl sm:p-10 animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 animate-gradient" />
        <div className="relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7 text-cyan-400" aria-hidden="true" />
            <p className="text-sm font-medium text-cyan-400">
              AI-Powered Financial Intelligence
            </p>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#f9fafb] sm:text-5xl">
            Real-time market insights and AI-generated financial news
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#f9fafb]/80">
            Nova Aetus delivers autonomous financial news coverage, quantitative research, and market analysis—powered by AI, free to access.
          </p>
          <div className="mt-8">
            <SearchBar className="max-w-2xl" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-3 text-sm font-medium text-white hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/50"
              aria-label="Read latest news"
            >
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Latest News
            </Link>
            <Link
              href="/markets"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#374151] bg-transparent px-5 py-3 text-sm font-medium text-[#f9fafb] hover:bg-[#2d3548] transition-all"
              aria-label="View market data"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              Markets
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="group rounded-2xl border border-[#374151] bg-[#1a1f35] p-6 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] glow-border">
          <div className="inline-flex rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 shadow-lg shadow-cyan-500/50">
            <Newspaper className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[#ededed]">
            AI-Generated News
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#ededed]/70">
            Autonomous coverage of market-moving events across 50+ tickers, updated daily.
          </p>
        </div>
        <div className="group rounded-2xl border border-[#374151] bg-[#1a1f35] p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] glow-border">
          <div className="inline-flex rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg shadow-purple-500/50">
            <BarChart3 className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[#f9fafb] group-hover:text-purple-400 transition-colors">
            Market Analysis
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#f9fafb]/70">
            Real-time data and quantitative insights powered by advanced analytics.
          </p>
        </div>
        <div className="group rounded-2xl border border-[#374151] bg-[#1a1f35] p-6 shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] glow-border">
          <div className="inline-flex rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 p-3 shadow-lg shadow-amber-500/50">
            <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[#f9fafb] group-hover:text-amber-400 transition-colors">
            Research & Datasets
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#f9fafb]/70">
            Open-source financial datasets and reproducible research artifacts.
          </p>
        </div>
      </section>

      {/* Latest News */}
      <section className="mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f9fafb]">
              Latest Financial News
            </h2>
            <p className="mt-1 text-sm text-[#f9fafb]/60">
              AI-generated insights on market-moving events
            </p>
          </div>
          <Link
            href="/news"
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
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
                className="group block rounded-2xl border border-[#374151] bg-[#1a1f35] p-6 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.02] glow-border"
              >
                <div className="flex items-center gap-2">
                  {article.tickers.length > 0 && (
                    <span className="rounded-full bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 px-2 py-1 text-xs font-medium text-cyan-400 border border-cyan-500/30">
                      {article.tickers[0]}
                    </span>
                  )}
                  {article.is_breaking && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-2 py-1 text-xs font-medium text-amber-400 border border-amber-500/30 animate-pulse">
                      Breaking
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-semibold text-[#f9fafb] group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-2 text-sm leading-6 text-[#f9fafb]/70 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-[#f9fafb]/50">
                  <div className="h-1 w-1 rounded-full bg-cyan-500" />
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 rounded-2xl border border-[#374151] bg-[#1a1f35] p-8 text-center">
              <p className="text-sm text-[#f9fafb]/60">No articles published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
