import { NextResponse } from "next/server"
import { z } from "zod"

import {
  countRoutinePublishedArticlesForUtcDay,
  createPublishedArticle,
  getNextActiveTicker,
  touchTickerLastArticleAt,
} from "@/lib/articles"
import { fetchMarketSnapshot, type MarketSnapshot } from "@/lib/alpaca"
import { generateArticleContent } from "@/lib/gemini"

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

  const bodyResult = generateArticlesBodySchema.safeParse(await readRequestJson({ request }))
  if (!bodyResult.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid request body",
      },
      { status: 400 },
    )
  }

  const now = new Date()
  const isBreaking = bodyResult.data.isBreaking ?? false

  if (!isBreaking) {
    const { count, startIso, endIso } = await countRoutinePublishedArticlesForUtcDay({
      now,
    })

    if (count >= MAX_ROUTINE_ARTICLES_PER_DAY) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Daily cap reached",
        cap: MAX_ROUTINE_ARTICLES_PER_DAY,
        count,
        startIso,
        endIso,
      })
    }
  }

  const symbol = bodyResult.data.symbol ?? (await getNextActiveTicker()).symbol

  if (!symbol) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "No active tickers found",
    })
  }

  try {
    const publishedAt = now.toISOString()
    const slug = createArticleSlug({ symbol, now })

    let title: string
    let excerpt: string
    let bodyMarkdown: string
    let tags: string[] = ["market-update"]
    let model: string | null = null
    let promptVersion: string = "v0"
    let marketSnapshot: MarketSnapshot | null = null

    const hasAlpacaKeys = process.env.ALPACA_API_KEY && process.env.ALPACA_API_SECRET
    const hasGeminiKey = process.env.GEMINI_API_KEY

    if (hasAlpacaKeys && hasGeminiKey) {
      try {
        marketSnapshot = await fetchMarketSnapshot({ symbol })
        
        const generated = await generateArticleContent({
          symbol,
          snapshot: marketSnapshot,
          isBreaking,
        })

        title = generated.title
        excerpt = generated.excerpt
        bodyMarkdown = generated.bodyMarkdown
        tags = generated.tags
        model = generated.model
        promptVersion = generated.promptVersion
      } catch (aiError) {
        console.error("AI generation failed, falling back to placeholder:", aiError)
        const date = publishedAt.slice(0, 10)
        title = `${symbol} Market Update — ${date}`
        excerpt = isBreaking ? `Breaking update for ${symbol}.` : `Routine market update for ${symbol}.`
        bodyMarkdown = buildPlaceholderMarkdown({ title, symbol, publishedAt, isBreaking })
      }
    } else {
      const date = publishedAt.slice(0, 10)
      title = `${symbol} Market Update — ${date}`
      excerpt = isBreaking ? `Breaking update for ${symbol}.` : `Routine market update for ${symbol}.`
      bodyMarkdown = buildPlaceholderMarkdown({ title, symbol, publishedAt, isBreaking })
    }

    const { article } = await createPublishedArticle({
      slug,
      title,
      excerpt,
      bodyMarkdown,
      tickers: [symbol],
      tags,
      isBreaking,
      model,
      promptVersion,
      marketSnapshot,
      sourceNews: marketSnapshot?.news ?? null,
      publishedAt,
    })

    await touchTickerLastArticleAt({ symbol, publishedAt })

    return NextResponse.json({
      ok: true,
      created: true,
      aiGenerated: !!(hasAlpacaKeys && hasGeminiKey && model),
      article: {
        id: article.id,
        slug: article.slug,
        publishedAt: article.published_at,
        symbol,
        isBreaking: article.is_breaking,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    )
  }
}

const MAX_ROUTINE_ARTICLES_PER_DAY = 13

const generateArticlesBodySchema = z.object({
  symbol: z.string().min(1).optional(),
  isBreaking: z.boolean().optional(),
})

async function readRequestJson({ request }: { request: Request }) {
  try {
    return (await request.json()) as unknown
  } catch {
    return {}
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

function buildPlaceholderMarkdown({
  title,
  symbol,
  publishedAt,
  isBreaking,
}: {
  title: string
  symbol: string
  publishedAt: string
  isBreaking: boolean
}) {
  return [
    `# ${title}`,
    "",
    `This is an auto-generated placeholder article for **${symbol}**.`,
    "",
    "## Key points",
    `- Published at: ${publishedAt}`,
    `- Category: ${isBreaking ? "Breaking" : "Routine"}`,
    "",
    "## Next steps",
    "- Pull market snapshot/news via Alpaca",
    "- Generate draft via Gemini",
    "- Post-process for SEO + TOC + ad insertion",
  ].join("\n")
}

function createArticleSlug({ symbol, now }: { symbol: string; now: Date }) {
  const safeSymbol = symbol
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const iso = now.toISOString()
  const date = iso.slice(0, 10)
  const time = iso.slice(11, 19).replace(/:/g, "")
  const random = crypto.randomUUID().slice(0, 8)

  return `${safeSymbol}-${date}-${time}-${random}`
}
 