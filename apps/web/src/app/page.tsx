import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, Zap, BarChart3, Globe, FileText, Database, Newspaper, BookOpen } from "lucide-react"

import { getPublishedArticles, type ArticleListItem } from "@/lib/articles"
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default async function HomePage() {
  const { articles } = await getPublishedArticles({ limit: 12 })

  // Categorize articles
  const breakingNews = articles.filter(a => a.is_breaking)
  const stockArticles = articles.filter(a => a.tickers && a.tickers.length > 0 && !a.tags?.includes("macro"))
  const macroArticles = articles.filter(a => a.tags?.includes("macro"))
  
  // Logic for featured article:
  // 1. If there's a breaking news article less than 12 hours old, feature it.
  // 2. Otherwise, feature the absolute latest article (routine or macro).
  const latestArticle = articles[0] ?? null
  const latestBreaking = breakingNews[0] ?? null
  
  let featuredArticle = latestArticle
  if (latestBreaking) {
    const breakingDate = new Date(latestBreaking.published_at)
    const hoursOld = (new Date().getTime() - breakingDate.getTime()) / (1000 * 60 * 60)
    if (hoursOld < 12) {
      featuredArticle = latestBreaking
    }
  }

  const latestNews = articles.slice(0, 6)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="sr-only">Nova Aetus</h1>
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="mb-6 bg-negative/10 border border-negative/20 rounded-lg px-4 py-2 flex items-center gap-3 overflow-hidden">
          <span className="flex items-center gap-1.5 text-xs font-bold text-negative uppercase tracking-wide shrink-0">
            <Zap className="h-3.5 w-3.5" />
            Breaking
          </span>
          <div className="flex gap-6 overflow-x-auto">
            {breakingNews.slice(0, 3).map((article) => (
              <Link 
                key={article.slug}
                href={`/news/${article.slug}`} 
                className="text-sm text-foreground hover:text-accent transition-colors whitespace-nowrap"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content Hub Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link href="/news" className="flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:border-accent/30 transition-colors group">
          <Newspaper className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-semibold text-foreground group-hover:text-accent">Stock News</p>
            <p className="text-xs text-foreground-muted">Real-time updates</p>
          </div>
        </Link>
        <Link href="/analysis" className="flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:border-accent/30 transition-colors group">
          <Globe className="h-5 w-5 text-accent-blue" />
          <div>
            <p className="text-sm font-semibold text-foreground group-hover:text-accent">Macro Analysis</p>
            <p className="text-xs text-foreground-muted">Global markets</p>
          </div>
        </Link>
        <Link href="/research" className="flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:border-accent/30 transition-colors group">
          <Database className="h-5 w-5 text-positive" />
          <div>
            <p className="text-sm font-semibold text-foreground group-hover:text-accent">Datasets</p>
            <p className="text-xs text-foreground-muted">Open research</p>
          </div>
        </Link>
        <Link href="/tools" className="flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:border-accent/30 transition-colors group">
          <BookOpen className="h-5 w-5 text-warning" />
          <div>
            <p className="text-sm font-semibold text-foreground group-hover:text-accent">Tools</p>
            <p className="text-xs text-foreground-muted">API & embeds</p>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Story */}
          {featuredArticle && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  Featured
                </h2>
              </div>
              <article className="group border border-border rounded-lg p-5 bg-surface/50 hover:border-accent/30 transition-colors">
                <Link href={`/news/${featuredArticle.slug}`} className="block">
                  <div className="flex items-center gap-2 mb-3">
                    {featuredArticle.is_breaking && (
                      <span className="text-xs font-bold text-negative uppercase">Breaking</span>
                    )}
                    {featuredArticle.tickers?.slice(0, 2).map((ticker) => (
                      <span key={ticker} className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                        {ticker}
                      </span>
                    ))}
                    {featuredArticle.tags?.includes("macro") && (
                      <span className="text-xs font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">MACRO</span>
                    )}
                    <span className="text-xs text-foreground-muted ml-auto">{formatDate(featuredArticle.published_at)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {featuredArticle.title}
                  </h3>
                  {featuredArticle.excerpt && (
                    <p className="mt-2 text-sm text-foreground-muted line-clamp-2">{featuredArticle.excerpt}</p>
                  )}
                </Link>
              </article>
            </section>
          )}

          {/* Stock News Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                Stock Reports
              </h2>
              <Link href="/news" className="text-xs text-accent hover:text-accent/80 flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {stockArticles.slice(0, 4).map((article) => (
                <ArticleCard key={article.slug} article={article} variant="stock" />
              ))}
              {stockArticles.length === 0 && (
                <p className="text-sm text-foreground-muted col-span-2">Stock reports coming soon...</p>
              )}
            </div>
          </section>

          {/* Macro Analysis Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent-blue" />
                Macro & Global
              </h2>
              <Link href="/analysis" className="text-xs text-accent hover:text-accent/80 flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {macroArticles.slice(0, 4).map((article) => (
                <ArticleCard key={article.slug} article={article} variant="macro" />
              ))}
              {macroArticles.length === 0 && (
                <p className="text-sm text-foreground-muted col-span-2">Macro analysis coming soon...</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Live Feed */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Live Feed
            </h3>
            <div className="space-y-3">
              {latestNews.map((article) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="block group border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {article.tickers?.slice(0, 1).map((t) => (
                      <span key={t} className="text-[10px] font-mono text-accent">{t}</span>
                    ))}
                    {article.tags?.includes("macro") && (
                      <span className="text-[10px] font-mono text-accent-blue">MACRO</span>
                    )}
                    <span className="text-[10px] text-foreground-muted ml-auto">{formatDate(article.published_at)}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Research Tools */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-positive" />
              Research Tools
            </h3>
            <div className="space-y-2">
              <Link href="/research" className="flex items-center justify-between text-sm text-foreground-muted hover:text-accent transition-colors py-1.5 border-b border-border">
                <span>Open Datasets</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/reproducibility" className="flex items-center justify-between text-sm text-foreground-muted hover:text-accent transition-colors py-1.5 border-b border-border">
                <span>Reproducibility</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/repos" className="flex items-center justify-between text-sm text-foreground-muted hover:text-accent transition-colors py-1.5 border-b border-border">
                <span>Embeds & APIs</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/tools" className="flex items-center justify-between text-sm text-foreground-muted hover:text-accent transition-colors py-1.5">
                <span>Code Examples</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* About Nova Aetus */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h3 className="text-sm font-bold text-foreground">AI-Powered Finance</h3>
            <p className="text-xs text-foreground-muted mt-2 leading-relaxed">
              Nova Aetus delivers real-time market analysis with AI-generated stock scores, 
              breaking news alerts, and open research datasets.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-[10px] bg-surface border border-border px-2 py-1 rounded">50+ Tickers</span>
              <span className="text-[10px] bg-surface border border-border px-2 py-1 rounded">Buy/Hold/Sell Ratings</span>
              <span className="text-[10px] bg-surface border border-border px-2 py-1 rounded">Open Data</span>
            </div>
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

function ArticleCard({ article, variant = "stock" }: { article: ArticleListItem; variant?: "stock" | "macro" }) {
  const accentColor = variant === "macro" ? "text-accent-blue" : "text-accent"
  const bgColor = variant === "macro" ? "bg-accent-blue/10" : "bg-accent/10"
  
  // Extract stock score if available (temporarily disabled until database column is added)
  
  // Calculate read time from excerpt (fallback to title if no excerpt)
  const textToAnalyze = article.excerpt || article.title
  const readTime = formatReadingTime(calculateReadingTime(textToAnalyze))
  
  return (
    <article className="group border border-border rounded-lg p-4 hover:border-accent/30 transition-colors">
      <Link href={`/news/${article.slug}`} className="block">
        <div className="flex items-center gap-2 mb-2">
          {article.tickers?.slice(0, 1).map((ticker) => (
            <span key={ticker} className={`text-[10px] font-mono ${accentColor} ${bgColor} px-1.5 py-0.5 rounded`}>
              {ticker}
            </span>
          ))}
          {/* Temporarily disabled stock score badges until database column is added */}
          {/* {ratingDisplay && (
            <span className={`text-[10px] font-bold ${ratingDisplay.color} ${ratingDisplay.bg} px-1.5 py-0.5 rounded flex items-center gap-0.5`}>
              {RatingIcon && <RatingIcon className="h-2.5 w-2.5" />}
              {ratingDisplay.label}
            </span>
          )} */}
          {article.tags?.includes("macro") && (
            <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">
              MACRO
            </span>
          )}
          <span className="text-[10px] text-foreground-muted ml-auto">{formatDate(article.published_at)}</span>
        </div>
        
        <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {article.title}
        </h4>
        
        <div className="flex items-center justify-between gap-2">
          {article.excerpt && (
            <p className="text-xs text-foreground-muted line-clamp-2 flex-1">{article.excerpt}</p>
          )}
          <span className="text-[10px] text-foreground-muted/70 whitespace-nowrap">{readTime}</span>
        </div>
        
        {/* Temporarily disabled stock score display until database column is added */}
        {/* {hasScore && stockScore.score && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-foreground-muted">Score</span>
              <span className={`text-[10px] font-bold ${ratingDisplay?.color}`}>
                {stockScore.score > 0 ? "+" : ""}{stockScore.score}/100
              </span>
            </div>
          </div>
        )} */}
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
