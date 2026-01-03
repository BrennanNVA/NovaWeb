import { NextResponse } from "next/server"

import {
  createPublishedArticle,
  getNextActiveTicker,
  touchTickerLastArticleAt,
} from "@/lib/articles"
import { generateArticleContent } from "@/lib/gemini"
import {
  detectBreakingNewsEvents,
  getActiveTickersForBreakingNews,
  generateBreakingNewsTitle,
  generateBreakingNewsExcerpt,
  type BreakingNewsEvent,
} from "@/lib/breaking-news-detector"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const expectedCronSecret = process.env.CRON_SECRET?.trim()
  if (!expectedCronSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "CRON_SECRET is not configured",
      },
      { status: 500 },
    )
  }

  const providedSecret = request.headers.get("x-cron-secret")?.trim()
  
  if (!providedSecret || providedSecret !== expectedCronSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      { status: 401 },
    )
  }

  try {
    // Get active tickers to monitor for breaking news
    const symbols = await getActiveTickersForBreakingNews()
    
    // Detect breaking news events
    const events = await detectBreakingNewsEvents(symbols)
    
    if (events.length === 0) {
      return NextResponse.json({
        ok: true,
        detected: 0,
        message: "No breaking news events detected",
      })
    }

    // Create breaking news articles for detected events
    const createdArticles = []
    
    for (const event of events.slice(0, 3)) { // Limit to top 3 events per run
      try {
        const now = new Date()
        const publishedAt = now.toISOString()
        const slug = createBreakingNewsSlug({ symbol: event.symbol, now })
        
        // Generate article content with breaking news context
        const generated = await generateArticleContent({
          symbol: event.symbol,
          snapshot: event.marketData,
          isBreaking: true,
        })

        const title = generateBreakingNewsTitle(event)
        const excerpt = generateBreakingNewsExcerpt(event)

        const { article } = await createPublishedArticle({
          slug,
          title: generated.title || title,
          excerpt: generated.excerpt || excerpt,
          bodyMarkdown: generated.bodyMarkdown,
          tickers: [event.symbol],
          tags: ["breaking-news", "market-update"],
          isBreaking: true,
          model: generated.model,
          promptVersion: generated.promptVersion,
          marketSnapshot: event.marketData,
          sourceNews: event.marketData.news,
          stockScore: generated.stockScore,
          publishedAt,
        })

        await touchTickerLastArticleAt({ symbol: event.symbol, publishedAt })
        
        createdArticles.push({
          id: article.id,
          slug: article.slug,
          symbol: event.symbol,
          reason: event.reason,
          severity: event.severity,
          priceChange: event.priceChange,
        })
      } catch (error) {
        console.error(`Failed to create breaking news article for ${event.symbol}:`, error)
      }
    }

    return NextResponse.json({
      ok: true,
      detected: events.length,
      created: createdArticles.length,
      events: events.map(e => ({
        symbol: e.symbol,
        reason: e.reason,
        severity: e.severity,
        priceChange: e.priceChange,
      })),
      articles: createdArticles,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Breaking news detection failed:", error)

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    )
  }
}

function createBreakingNewsSlug({ symbol, now }: { symbol: string; now: Date }) {
  const safeSymbol = symbol
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const iso = now.toISOString()
  const date = iso.slice(0, 10)
  const time = iso.slice(11, 19).replace(/:/g, "")
  const random = crypto.randomUUID().slice(0, 8)

  return `breaking-${safeSymbol}-${date}-${time}-${random}`
}
