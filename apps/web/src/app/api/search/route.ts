import { NextResponse } from "next/server"
import { z } from "zod"

import { createPublicSupabaseClient } from "@/lib/supabase/public-client"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = (url.searchParams.get("q") ?? "").trim().replace(/,/g, " ")

  const queryResult = searchQuerySchema.safeParse({ query })
  if (!queryResult.success) {
    return NextResponse.json({ tickers: [], articles: [] })
  }

  const supabase = createPublicSupabaseClient()

  const like = `%${queryResult.data.query}%`

  const [{ data: tickers, error: tickersError }, { data: articles, error: articlesError }] =
    await Promise.all([
      supabase
        .from("tickers")
        .select("symbol")
        .eq("is_active", true)
        .ilike("symbol", like)
        .order("priority", { ascending: false })
        .limit(8),
      supabase
        .from("articles")
        .select("slug, title, tickers, published_at")
        .eq("status", "published")
        .or(`title.ilike.${like},excerpt.ilike.${like}`)
        .order("published_at", { ascending: false })
        .limit(8),
    ])

  if (tickersError || articlesError) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to run search",
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    tickers: (tickers ?? []).map((ticker) => ({ symbol: ticker.symbol })),
    articles: (articles ?? []).map((article) => ({
      slug: article.slug,
      title: article.title,
      publishedAt: article.published_at,
      tickers: article.tickers ?? [],
    })),
  })
}

const searchQuerySchema = z.object({
  query: z.string().min(2).max(80),
})
