import { NextResponse } from "next/server"

import { createPublishedArticle } from "@/lib/articles"
import { fetchWorldBreakingNews, fetchTopHeadlines } from "@/lib/newsapi"
import { generateWorldNewsArticle } from "@/lib/gemini"

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

  const providedSecret = getCronSecretFromRequest({ request })?.trim()
  
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
    const hasNewsAPIKey = !!process.env.NEWSAPI_KEY
    const hasGeminiKey = !!process.env.GEMINI_API_KEY

    if (!hasNewsAPIKey) {
      return NextResponse.json({
        ok: false,
        error: "NEWSAPI_KEY is not configured",
      }, { status: 500 })
    }

    if (!hasGeminiKey) {
      return NextResponse.json({
        ok: false,
        error: "GEMINI_API_KEY is not configured",
      }, { status: 500 })
    }

    // Fetch breaking news from NewsAPI
    const breakingNews = await fetchWorldBreakingNews()
    const businessNews = await fetchTopHeadlines({ category: "business", pageSize: 5 })
    const generalNews = await fetchTopHeadlines({ category: "general", pageSize: 5 })

    // Combine and deduplicate news
    const allNews = [...breakingNews, ...businessNews, ...generalNews]
    const uniqueNews = allNews.filter((item, index, self) =>
      index === self.findIndex((t) => t.title === item.title)
    ).slice(0, 10)

    if (uniqueNews.length === 0) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "No news articles found",
      })
    }

    // Generate article from world news
    const generated = await generateWorldNewsArticle({ newsItems: uniqueNews })

    const now = new Date()
    const slug = createWorldNewsSlug({ now })

    const { article } = await createPublishedArticle({
      slug,
      title: generated.title,
      excerpt: generated.excerpt,
      bodyMarkdown: generated.bodyMarkdown,
      tickers: [],
      tags: generated.tags,
      isBreaking: true,
      model: generated.model,
      promptVersion: generated.promptVersion,
      marketSnapshot: null,
      sourceNews: uniqueNews.slice(0, 5),
      publishedAt: now.toISOString(),
    })

    return NextResponse.json({
      ok: true,
      created: true,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        publishedAt: article.published_at,
      },
      sourcesUsed: uniqueNews.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("World news generation failed:", error)

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    )
  }
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

function createWorldNewsSlug({ now }: { now: Date }) {
  const iso = now.toISOString()
  const date = iso.slice(0, 10)
  const time = iso.slice(11, 19).replace(/:/g, "")
  const random = crypto.randomUUID().slice(0, 8)

  return `world-news-${date}-${time}-${random}`
}
