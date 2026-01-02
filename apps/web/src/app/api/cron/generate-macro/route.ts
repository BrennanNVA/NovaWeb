import { NextResponse } from "next/server"
import { z } from "zod"

import { createPublishedArticle } from "@/lib/articles"
import { generateMacroArticle, getRandomMacroTopic, type MacroTopic } from "@/lib/gemini"

export const runtime = "nodejs"

const VALID_TOPICS: MacroTopic[] = [
  "fed-policy",
  "inflation", 
  "employment",
  "gdp",
  "global-markets",
  "commodities",
  "crypto-market",
  "sector-rotation",
]

export async function POST(request: Request) {
  const expectedCronSecret = process.env.CRON_SECRET?.trim()
  if (!expectedCronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 500 }
    )
  }

  const providedSecret = getCronSecretFromRequest({ request })?.trim()
  if (!providedSecret || providedSecret !== expectedCronSecret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const bodyResult = macroBodySchema.safeParse(await readRequestJson({ request }))
  if (!bodyResult.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    )
  }

  const hasGeminiKey = process.env.GEMINI_API_KEY

  if (!hasGeminiKey) {
    return NextResponse.json(
      { ok: false, error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    )
  }

  const topic = bodyResult.data.topic ?? getRandomMacroTopic()
  const now = new Date()

  try {
    const generated = await generateMacroArticle({ topic })

    const publishedAt = now.toISOString()
    const slug = createMacroSlug({ topic, now })

    const { article } = await createPublishedArticle({
      slug,
      title: generated.title,
      excerpt: generated.excerpt,
      bodyMarkdown: generated.bodyMarkdown,
      tickers: [],
      tags: generated.tags,
      isBreaking: false,
      model: generated.model,
      promptVersion: generated.promptVersion,
      marketSnapshot: null,
      sourceNews: null,
      publishedAt,
    })

    return NextResponse.json({
      ok: true,
      created: true,
      topic,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        publishedAt: article.published_at,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    )
  }
}

const macroBodySchema = z.object({
  topic: z.enum(VALID_TOPICS as [MacroTopic, ...MacroTopic[]]).optional(),
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
  return match?.[1] ?? null
}

function createMacroSlug({ topic, now }: { topic: string; now: Date }) {
  const safeTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const iso = now.toISOString()
  const date = iso.slice(0, 10)
  const time = iso.slice(11, 19).replace(/:/g, "")
  const random = crypto.randomUUID().slice(0, 8)

  return `macro-${safeTopic}-${date}-${time}-${random}`
}
