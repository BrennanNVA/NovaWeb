import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Clock, BarChart3, Globe } from "lucide-react"

import { getPublishedArticles } from "@/lib/articles"
import { fetchMarketSnapshot } from "@/lib/alpaca"
import { calculateStockScore, formatScoreForArticle, type StockScore } from "@/lib/stock-score"

import { getStockLogoUrl } from "@/lib/stock-images"

interface StockPageProps {
  params: Promise<{
    symbol: string
  }>
}

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const { symbol } = await params
  const normalizedSymbol = symbol.toUpperCase()
  const logoUrl = getStockLogoUrl({ ticker: normalizedSymbol })
  
  return {
    title: `${normalizedSymbol} Stock Analysis`,
    description: `Latest AI-powered analysis, market data, and news for ${normalizedSymbol} stock. Get real-time insights and stock score ratings.`,
    alternates: {
      canonical: `/stocks/${normalizedSymbol.toLowerCase()}`,
    },
    openGraph: {
      title: `${normalizedSymbol} Stock Analysis | Nova Aetus`,
      description: `Latest AI-powered analysis, market data, and news for ${normalizedSymbol} stock.`,
      images: logoUrl ? [
        {
          url: logoUrl,
          width: 400,
          height: 400,
          alt: `${normalizedSymbol} logo`,
        }
      ] : [],
    },
    twitter: {
      card: "summary",
      title: `${normalizedSymbol} Stock Analysis | Nova Aetus`,
      description: `Latest AI-powered analysis, market data, and news for ${normalizedSymbol} stock.`,
      images: logoUrl ? [logoUrl] : [],
    },
  }
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params
  const normalizedSymbol = symbol.toUpperCase()

  // Fetch recent articles for this stock
  const { articles } = await getPublishedArticles({ limit: 20, ticker: normalizedSymbol })
  
  if (articles.length === 0) {
    notFound()
  }

  // Get latest market data
  let marketSnapshot = null
  let stockScore: StockScore | null = null
  
  try {
    marketSnapshot = await fetchMarketSnapshot({ symbol: normalizedSymbol })
    stockScore = calculateStockScore(marketSnapshot)
  } catch (error) {
    console.error(`Failed to fetch market data for ${normalizedSymbol}:`, error)
  }

  const now = new Date()

  // Get rating display
  const getRatingDisplay = (rating: string) => {
    switch (rating) {
      case "buy":
        return { icon: TrendingUp, color: "text-positive", bg: "bg-positive/10", label: "BUY" }
      case "sell":
        return { icon: TrendingDown, color: "text-negative", bg: "bg-negative/10", label: "SELL" }
      default:
        return { icon: Minus, color: "text-warning", bg: "bg-warning/10", label: "HOLD" }
    }
  }

  const ratingDisplay = stockScore ? getRatingDisplay(stockScore.overall) : null
  const RatingIcon = ratingDisplay?.icon

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/news" 
            className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{normalizedSymbol}</h1>
            <p className="text-foreground-muted">
              Latest analysis and market insights for {normalizedSymbol} stock
            </p>
          </div>

          {stockScore && (
            <div className="flex flex-col items-end gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${ratingDisplay?.bg} ${ratingDisplay?.color} border-current/20`}>
                {RatingIcon && <RatingIcon className="h-5 w-5" />}
                <span className="font-bold text-lg">{ratingDisplay?.label}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Score: {stockScore.score > 0 ? "+" : ""}{stockScore.score}/100</p>
                <p className="text-xs text-foreground-muted">Confidence: {stockScore.confidence}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Market Data */}
      {marketSnapshot && (
        <section className="mb-8">
          <div className="border border-border rounded-lg p-6 bg-surface/50">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Current Market Data
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">Price</p>
                <p className="text-lg font-semibold text-foreground">
                  ${marketSnapshot.latestBar?.c.toFixed(2) ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">Change</p>
                <p className={`text-lg font-semibold ${marketSnapshot.changePercent && marketSnapshot.changePercent >= 0 ? "text-positive" : "text-negative"}`}>
                  {marketSnapshot.changePercent ? (marketSnapshot.changePercent >= 0 ? "+" : "") + marketSnapshot.changePercent.toFixed(2) + "%" : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">Volume</p>
                <p className="text-lg font-semibold text-foreground">
                  {marketSnapshot.latestBar ? (marketSnapshot.latestBar.v / 1000000).toFixed(2) + "M" : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">Updated</p>
                <p className="text-sm text-foreground-muted">
                  {new Date(marketSnapshot.latestBar?.t ?? now.getTime()).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stock Score Analysis */}
      {stockScore && (
        <section className="mb-8">
          <div className="border border-border rounded-lg p-6 bg-surface/50">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Nova Aetus Analysis
            </h2>
            
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formatScoreForArticle(stockScore).replace(/\n/g, '<br>') }} />
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Recent Analysis
          </h2>
          <span className="text-sm text-foreground-muted">
            {articles.length} articles
          </span>
        </div>

        <div className="space-y-4">
          {articles.map((article) => (
            <article key={article.id} className="border border-border rounded-lg p-4 hover:border-accent/30 transition-colors">
              <Link href={`/news/${article.slug}`} className="block">
                <div className="flex items-center gap-2 mb-2">
                  {article.is_breaking && (
                    <span className="text-xs font-bold text-negative uppercase">Breaking</span>
                  )}
                  {article.tags?.includes("macro") && (
                    <span className="text-xs font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">
                      MACRO
                    </span>
                  )}
                  <span className="text-xs text-foreground-muted ml-auto">
                    {new Date(article.published_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-base font-semibold text-foreground hover:text-accent transition-colors mb-2">
                  {article.title}
                </h3>
                
                {article.excerpt && (
                  <p className="text-sm text-foreground-muted line-clamp-2">{article.excerpt}</p>
                )}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
