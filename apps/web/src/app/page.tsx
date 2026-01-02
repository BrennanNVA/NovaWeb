import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getPublishedArticles } from "@/lib/articles"

export default async function HomePage() {
  const { articles } = await getPublishedArticles({ limit: 3 })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section - Elastic Style */}
      <section className="border-b border-[#2a2a2a] pb-16">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold tracking-tight text-[#e5e5e5] sm:text-6xl lg:text-7xl">
            Financial intelligence,
            <br />
            <span className="text-[#00bfa5]">powered by AI</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-[#a3a3a3]">
            Real-time market analysis and autonomous news coverage across 50+ tickers.
            Free, open, and built for traders.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-md bg-[#00bfa5] px-6 py-3 text-sm font-semibold text-[#0d0d0d] hover:bg-[#00d4b8] transition-colors"
            >
              View latest news
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-md border border-[#2a2a2a] px-6 py-3 text-sm font-semibold text-[#e5e5e5] hover:border-[#3a3a3a] hover:bg-[#1a1a1a] transition-colors"
            >
              Explore research
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News - Clean Grid */}
      <section className="mt-16">
        <div className="flex items-end justify-between border-b border-[#2a2a2a] pb-4">
          <div>
            <h2 className="text-3xl font-bold text-[#e5e5e5]">
              Latest news
            </h2>
            <p className="mt-2 text-sm text-[#a3a3a3]">
              AI-generated market coverage
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#00bfa5] hover:text-[#00d4b8] transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="mt-8 space-y-px">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group block border-b border-[#2a2a2a] bg-[#1a1a1a] p-6 hover:bg-[#242424] transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {article.tickers.length > 0 && (
                        <span className="inline-flex items-center rounded-md bg-[#00bfa5]/10 px-2 py-1 text-xs font-medium text-[#00bfa5]">
                          {article.tickers[0]}
                        </span>
                      )}
                      {article.is_breaking && (
                        <span className="inline-flex items-center rounded-md bg-[#ff6b6b]/10 px-2 py-1 text-xs font-medium text-[#ff6b6b]">
                          Breaking
                        </span>
                      )}
                      <span className="text-xs text-[#a3a3a3]">
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#e5e5e5] group-hover:text-[#00bfa5] transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-2 text-sm leading-6 text-[#a3a3a3] line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#a3a3a3] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          ) : (
            <div className="border border-[#2a2a2a] bg-[#1a1a1a] p-12 text-center">
              <p className="text-sm text-[#a3a3a3]">No articles published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
