import Link from "next/link"
import { ArrowRight, TrendingUp, Clock, Zap, BarChart3, Globe } from "lucide-react"

import { getPublishedArticles, type ArticleListItem } from "@/lib/articles"

export default async function HomePage() {
  const { articles } = await getPublishedArticles({ limit: 8 })

  const featuredArticle = articles[0] ?? null
  const topStories = articles.slice(1, 4)
  const latestNews = articles.slice(4, 8)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Stories Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Top Stories</h1>
        <Link href="/news" className="text-sm text-accent hover:text-accent/80 flex items-center gap-1">
          All news <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Article */}
          {featuredArticle && (
            <article className="group">
              <Link href={`/news/${featuredArticle.slug}`} className="block">
                <div className="flex items-center gap-2 mb-3">
                  {featuredArticle.is_breaking && (
                    <span className="flex items-center gap-1 text-xs font-bold text-negative uppercase">
                      <Zap className="h-3 w-3" /> Breaking
                    </span>
                  )}
                  {featuredArticle.tickers?.slice(0, 2).map((ticker) => (
                    <span key={ticker} className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {ticker}
                    </span>
                  ))}
                  <span className="text-xs text-foreground-muted ml-auto flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(featuredArticle.published_at)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>
                {featuredArticle.excerpt && (
                  <p className="mt-3 text-foreground-muted leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                )}
              </Link>
            </article>
          )}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* More Stories Grid */}
          <div>
            <h3 className="text-sm font-bold text-foreground-muted uppercase tracking-wide mb-4">More Stories</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {topStories.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Latest News */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Latest
            </h3>
            <div className="space-y-4">
              {latestNews.map((article) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="block group border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {formatDate(article.published_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">Explore</h3>
            <div className="space-y-2">
              <Link href="/markets" className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors py-1">
                <BarChart3 className="h-4 w-4" /> Markets
              </Link>
              <Link href="/analysis" className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors py-1">
                <Globe className="h-4 w-4" /> Analysis
              </Link>
              <Link href="/research" className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors py-1">
                <TrendingUp className="h-4 w-4" /> Research
              </Link>
            </div>
          </div>

          {/* Subscribe CTA */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <h3 className="text-sm font-bold text-foreground">Stay Updated</h3>
            <p className="text-xs text-foreground-muted mt-1">
              AI-powered market insights delivered daily.
            </p>
            <Link
              href="/about"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80"
            >
              Learn more <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <article className="group">
      <Link href={`/news/${article.slug}`} className="block">
        <div className="flex items-center gap-2 mb-2">
          {article.tickers?.slice(0, 1).map((ticker) => (
            <span key={ticker} className="text-[10px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">
              {ticker}
            </span>
          ))}
          {article.tags?.includes("macro") && (
            <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">
              MACRO
            </span>
          )}
        </div>
        <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {article.title}
        </h4>
        <p className="text-xs text-foreground-muted mt-1">
          {formatDate(article.published_at)}
        </p>
      </Link>
    </article>
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
