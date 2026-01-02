import type { Metadata } from "next"
import Link from "next/link"
import { TrendingUp, Globe, BarChart3, Zap, ArrowRight } from "lucide-react"

import { getPublishedArticles } from "@/lib/articles"

export const metadata: Metadata = {
  title: "Analysis",
}

export const dynamic = "force-dynamic"

export default async function AnalysisPage() {
  const { articles } = await getPublishedArticles({ limit: 10 })
  
  const macroArticles = articles.filter(a => a.tags?.includes("macro")).slice(0, 3)
  const marketArticles = articles.filter(a => a.tickers?.length > 0).slice(0, 4)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analysis
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-foreground-muted">
          AI-generated market analysis, macro insights, and sector coverage updated throughout the day.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Macro Analysis */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Macro Analysis</span>
              </div>
              <Link href="/news?q=macro" className="text-[10px] text-accent hover:text-accent/80">View all →</Link>
            </div>
            
            {macroArticles.length > 0 ? (
              <div className="space-y-3">
                {macroArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/news/${article.slug}`}
                    className="block rounded-xl border border-border-subtle bg-background/40 p-4 hover:border-accent/30 transition-colors"
                  >
                    <h3 className="text-sm font-medium text-foreground line-clamp-2">{article.title}</h3>
                    {article.excerpt && (
                      <p className="mt-1 text-xs text-foreground-muted line-clamp-2">{article.excerpt}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      {article.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground-muted">Macro analysis articles are being generated...</p>
            )}
          </div>

          {/* Market Coverage */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Market Coverage</span>
              </div>
              <Link href="/news" className="text-[10px] text-accent hover:text-accent/80">View all →</Link>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {marketArticles.length > 0 ? (
                marketArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/news/${article.slug}`}
                    className="block rounded-xl border border-border-subtle bg-background/40 p-3 hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {article.tickers?.slice(0, 1).map((ticker) => (
                        <span key={ticker} className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">{ticker}</span>
                      ))}
                      {article.is_breaking && (
                        <span className="text-[9px] text-warning bg-warning/10 px-2 py-0.5 rounded-full">Breaking</span>
                      )}
                    </div>
                    <h3 className="text-xs font-medium text-foreground line-clamp-2">{article.title}</h3>
                  </Link>
                ))
              ) : (
                <p className="col-span-2 text-sm text-foreground-muted">Market coverage articles are being generated...</p>
              )}
            </div>
          </div>

          {/* Analysis Categories */}
          <div className="grid gap-4 sm:grid-cols-2">
            {ANALYSIS_CATEGORIES.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="rounded-2xl border border-border bg-surface/60 p-5 hover:border-accent/30 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className="h-4 w-4 text-accent" />
                  <span className="text-xs font-medium text-foreground">{category.title}</span>
                </div>
                <p className="text-xs text-foreground-muted">{category.description}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-accent group-hover:text-accent/80">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">Coverage Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold text-foreground">50+</p>
                <p className="text-[10px] text-foreground-muted">Tickers tracked</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">8</p>
                <p className="text-[10px] text-foreground-muted">Macro topics</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">24/7</p>
                <p className="text-[10px] text-foreground-muted">AI monitoring</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">Real-time</p>
                <p className="text-[10px] text-foreground-muted">Updates</p>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <p className="text-xs font-medium text-foreground mb-3">Macro Topics</p>
            <div className="flex flex-wrap gap-2">
              {MACRO_TOPICS.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/news?q=${topic.id}`}
                  className="rounded-full border border-border-subtle bg-background/40 px-3 py-1 text-[10px] text-foreground-muted hover:border-accent/30 hover:text-accent transition-colors"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <h3 className="text-sm font-medium text-foreground">Explore More</h3>
            <p className="mt-1 text-xs text-foreground-muted">
              Browse our full news feed and research datasets.
            </p>
            <div className="mt-3 space-y-2">
              <Link href="/news" className="flex items-center gap-1 text-xs text-accent hover:text-accent/80">
                News Feed <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/research" className="flex items-center gap-1 text-xs text-accent hover:text-accent/80">
                Research <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/markets" className="flex items-center gap-1 text-xs text-accent hover:text-accent/80">
                Markets <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ANALYSIS_CATEGORIES = [
  {
    title: "Macro & Economy",
    description: "Fed policy, inflation, employment, and GDP analysis.",
    href: "/news?q=macro",
    icon: Globe,
  },
  {
    title: "Sector Analysis",
    description: "Tech, healthcare, energy, and financial sector coverage.",
    href: "/news?q=sector",
    icon: BarChart3,
  },
  {
    title: "Crypto Markets",
    description: "Bitcoin, Ethereum, and digital asset analysis.",
    href: "/news?q=crypto",
    icon: Zap,
  },
  {
    title: "Breaking News",
    description: "Real-time coverage of market-moving events.",
    href: "/news",
    icon: TrendingUp,
  },
]

const MACRO_TOPICS = [
  { id: "fed-policy", label: "Fed Policy" },
  { id: "inflation", label: "Inflation" },
  { id: "employment", label: "Employment" },
  { id: "global-markets", label: "Global Markets" },
  { id: "crypto", label: "Crypto" },
  { id: "commodities", label: "Commodities" },
]
