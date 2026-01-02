import Link from "next/link"
import { ArrowRight, TrendingUp, Globe, BarChart3, Zap } from "lucide-react"

import { getPublishedArticles } from "@/lib/articles"

export default async function HomePage() {
  const { articles } = await getPublishedArticles({ limit: 6 })

  const featuredArticle = articles[0] ?? null
  const marketArticles = articles.slice(1, 3)
  const recentArticles = articles.slice(3, 6)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section - Compact */}
      <section className="pb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Financial intelligence,
            <span className="text-accent"> powered by AI</span>
          </h1>
          <p className="mt-4 text-lg leading-7 text-foreground-muted">
            Real-time market analysis and autonomous news coverage across 50+ tickers.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
            >
              Browse news
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-accent/30 transition-colors"
            >
              Research
            </Link>
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-accent/30 transition-colors"
            >
              Markets
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid - Fixed Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Featured Story - Left Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Featured</span>
          </div>
          
          {featuredArticle ? (
            <Link
              href={`/news/${featuredArticle.slug}`}
              className="group block rounded-2xl border border-border bg-surface/60 p-6 hover:border-accent/30 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {featuredArticle.is_breaking && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-[10px] font-medium text-warning">
                    <TrendingUp className="h-3 w-3" />
                    Breaking
                  </span>
                )}
                {featuredArticle.tickers?.slice(0, 2).map((ticker) => (
                  <span key={ticker} className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-mono text-accent">
                    {ticker}
                  </span>
                ))}
                <span className="text-[10px] text-foreground-muted font-mono ml-auto">
                  {formatDate(featuredArticle.published_at)}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                {featuredArticle.title}
              </h2>
              {featuredArticle.excerpt && (
                <p className="mt-2 text-sm text-foreground-muted line-clamp-2">
                  {featuredArticle.excerpt}
                </p>
              )}
            </Link>
          ) : (
            <div className="rounded-2xl border border-border bg-surface/60 p-6 text-center text-sm text-foreground-muted">
              No featured article yet.
            </div>
          )}

          {/* Market Updates Row */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Market Updates</span>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {marketArticles.length > 0 ? (
                marketArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/news/${article.slug}`}
                    className="group block rounded-xl border border-border bg-surface/40 p-4 hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {article.tickers?.slice(0, 1).map((ticker) => (
                        <span key={ticker} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
                          {ticker}
                        </span>
                      ))}
                      <span className="text-[10px] text-foreground-muted font-mono ml-auto">
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 rounded-xl border border-border bg-surface/40 p-4 text-center text-xs text-foreground-muted">
                  More market updates coming soon.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Quick Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold text-foreground">50+</p>
                <p className="text-xs text-foreground-muted">Tickers tracked</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">24/7</p>
                <p className="text-xs text-foreground-muted">AI monitoring</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">Real-time</p>
                <p className="text-xs text-foreground-muted">Market data</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">Free</p>
                <p className="text-xs text-foreground-muted">Open access</p>
              </div>
            </div>
          </div>

          {/* Recent Articles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Recent</span>
              <Link href="/news" className="text-xs text-accent hover:text-accent/80 transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/news/${article.slug}`}
                    className="group block rounded-xl border border-border bg-surface/40 p-3 hover:border-accent/30 transition-colors"
                  >
                    <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </p>
                    <p className="mt-1 text-[10px] text-foreground-muted font-mono">
                      {formatDate(article.published_at)}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-xl border border-border bg-surface/40 p-3 text-center text-xs text-foreground-muted">
                  More articles coming soon.
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <h3 className="text-sm font-medium text-foreground">Stay informed</h3>
            <p className="mt-1 text-xs text-foreground-muted">
              Get AI-generated market insights delivered to your feed.
            </p>
            <Link
              href="/news"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Explore coverage
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
