import "server-only"

import { createPublicSupabaseClient } from "@/lib/supabase/public-client"
import { createServiceSupabaseClient } from "@/lib/supabase/service-client"

export async function getPublishedArticles({ limit, query, ticker }: GetPublishedArticlesArgs) {
  if (limit <= 0) return { articles: [] }

  const supabase = createPublicSupabaseClient()

  const cleanedQuery = query?.trim().replace(/,/g, " ")
  const cleanedTicker = ticker?.trim()

  let request = supabase
    .from("articles")
    .select("id, slug, title, excerpt, tickers, tags, is_breaking, published_at")
    .eq("status", "published")

  if (cleanedTicker) request = request.contains("tickers", [cleanedTicker])

  if (cleanedQuery && cleanedQuery.length >= 2) {
    const like = `%${cleanedQuery}%`
    request = request.or(`title.ilike.${like},excerpt.ilike.${like}`)
  }

  const { data, error } = await request.order("published_at", { ascending: false }).limit(limit)

  if (error) throw new Error(`Failed to fetch published articles: ${error.message}`)

  return { articles: (data ?? []) as ArticleListItem[] }
}

export async function getPublishedArticleBySlug({ slug }: GetPublishedArticleBySlugArgs) {
  if (!slug) return { article: null }

  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) throw new Error(`Failed to fetch article: ${error.message}`)

  return { article: (data ?? null) as Article | null }
}

export async function countRoutinePublishedArticlesForUtcDay({
  now,
}: CountRoutinePublishedArticlesForUtcDayArgs) {
  const { startIso, endIso } = getUtcDayRange({ now })

  const supabase = createServiceSupabaseClient()

  const { count, error } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .eq("is_breaking", false)
    .gte("published_at", startIso)
    .lt("published_at", endIso)

  if (error) throw new Error(`Failed to count routine articles: ${error.message}`)

  return { count: count ?? 0, startIso, endIso }
}

export async function getNextActiveTicker() {
  const supabase = createServiceSupabaseClient()

  const { data, error } = await supabase
    .from("tickers")
    .select("symbol, last_article_at, priority")
    .eq("is_active", true)
    .order("priority", { ascending: false })
    .order("last_article_at", { ascending: true, nullsFirst: true })
    .order("symbol", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`Failed to pick next ticker: ${error.message}`)

  return { symbol: data?.symbol ?? null }
}

export async function touchTickerLastArticleAt({
  symbol,
  publishedAt,
}: TouchTickerLastArticleAtArgs) {
  if (!symbol) return { ok: false }

  const supabase = createServiceSupabaseClient()

  const { error } = await supabase
    .from("tickers")
    .update({ last_article_at: publishedAt })
    .eq("symbol", symbol)

  if (error) throw new Error(`Failed to update ticker: ${error.message}`)

  return { ok: true }
}

export async function createPublishedArticle({
  slug,
  title,
  excerpt,
  bodyMarkdown,
  tickers,
  tags,
  isBreaking,
  model,
  promptVersion,
  marketSnapshot,
  sourceNews,
  publishedAt,
}: CreatePublishedArticleArgs) {
  const supabase = createServiceSupabaseClient()

  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug,
      status: "published",
      title,
      excerpt: excerpt ?? null,
      body_markdown: bodyMarkdown,
      tickers,
      tags: tags ?? [],
      is_breaking: isBreaking ?? false,
      model: model ?? null,
      prompt_version: promptVersion ?? null,
      market_snapshot: marketSnapshot ?? null,
      source_news: sourceNews ?? null,
      published_at: publishedAt ?? new Date().toISOString(),
    })
    .select("*")
    .single()

  if (error) throw new Error(`Failed to create article: ${error.message}`)
  if (!data) throw new Error("Failed to create article")

  return { article: data as Article }
}

function getUtcDayRange({ now }: { now: Date }) {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
  )
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0,
    ),
  )

  return { startIso: start.toISOString(), endIso: end.toISOString() }
}

interface GetPublishedArticlesArgs {
  limit: number
  query?: string
  ticker?: string
}

interface GetPublishedArticleBySlugArgs {
  slug: string
}

interface CountRoutinePublishedArticlesForUtcDayArgs {
  now: Date
}

interface TouchTickerLastArticleAtArgs {
  symbol: string
  publishedAt: string
}

interface CreatePublishedArticleArgs {
  slug: string
  title: string
  excerpt?: string | null
  bodyMarkdown: string
  tickers: string[]
  tags?: string[]
  isBreaking?: boolean
  model?: string | null
  promptVersion?: string | null
  marketSnapshot?: unknown
  sourceNews?: unknown
  publishedAt?: string
}

export interface ArticleListItem {
  id: string
  slug: string
  title: string
  excerpt: string | null
  tickers: string[]
  tags: string[]
  is_breaking: boolean
  published_at: string
}

export interface Article {
  id: string
  slug: string
  status: "draft" | "published"
  title: string
  excerpt: string | null
  body_markdown: string
  tickers: string[]
  tags: string[]
  is_breaking: boolean
  model: string | null
  prompt_version: string | null
  market_snapshot: unknown | null
  source_news: unknown | null
  published_at: string
  created_at: string
}
