import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import {
  createPublishedArticle,
  touchTickerLastArticleAt,
} from "@/lib/articles"
import { generateArticleContent } from "@/lib/gemini"
import {
  detectBreakingNewsEvents,
  getActiveTickersForBreakingNews,
  generateBreakingNewsTitle,
  generateBreakingNewsExcerpt,
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

  const providedSecret = getCronSecretFromRequest({ request })
  
  if (!compareSecrets(providedSecret, expectedCronSecret)) {
    const cleanExpected = expectedCronSecret?.trim().replace(/^["']|["']$/g, "")
    const cleanProvided = providedSecret?.trim().replace(/^["']|["']$/g, "")

    console.error(`[Breaking News Cron] Unauthorized mismatch`)
    console.error(`[Breaking News Cron] Expected length (clean): ${cleanExpected?.length}, Provided length (clean): ${cleanProvided?.length}`)
    
    // Find exact mismatch position
    if (cleanExpected && cleanProvided) {
      for (let i = 0; i < Math.max(cleanExpected.length, cleanProvided.length); i++) {
        if (cleanExpected[i] !== cleanProvided[i]) {
          console.error(`[Breaking News Cron] MISMATCH at position ${i}: expected char code ${cleanExpected.charCodeAt(i)}, got char code ${cleanProvided.charCodeAt(i)}`)
          console.error(`[Breaking News Cron] Expected around mismatch: "...${cleanExpected.slice(Math.max(0, i-3), i+4)}..."`)
          console.error(`[Breaking News Cron] Provided around mismatch: "...${cleanProvided.slice(Math.max(0, i-3), i+4)}..."`)
          break
        }
      }
    }
    
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
        debug: {
          expectedLen: cleanExpected?.length,
          providedLen: cleanProvided?.length,
          expectedFirstChar: cleanExpected?.[0],
          providedFirstChar: cleanProvided?.[0],
          expectedLastChar: cleanExpected?.[cleanExpected.length - 1],
          providedLastChar: cleanProvided?.[cleanProvided.length - 1],
        }
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
        console.log(`[Breaking News Cron] Processing event for ${event.symbol}: ${event.reason}`)
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
          publishedAt,
        })

        console.log(`[Breaking News Cron] Created article: ${article.slug}`)

        await touchTickerLastArticleAt({ symbol: event.symbol, publishedAt })
        
        console.log(`[Breaking News Cron] Purging cache for /, /news, /stocks/${event.symbol.toLowerCase()}`)
        revalidatePath("/")
        revalidatePath("/news")
        revalidatePath(`/stocks/${event.symbol.toLowerCase()}`)

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

function getCronSecretFromRequest({ request }: { request: Request }) {
  const headerValue = request.headers.get("x-cron-secret")
  if (headerValue) return headerValue

  const auth = request.headers.get("authorization")
  if (!auth) return null

  const match = auth.match(/^Bearer\s+(.+)$/i)
  if (!match) return null

  return match[1] ?? null
}

function compareSecrets(provided: string | null | undefined, expected: string | null | undefined): boolean {
  if (!provided || !expected) return false
  
  const cleanProvided = provided.trim().replace(/^["']|["']$/g, "")
  const cleanExpected = expected.trim().replace(/^["']|["']$/g, "")
  
  return cleanProvided === cleanExpected
}
