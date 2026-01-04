import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Building2 } from "lucide-react"

import type { ArticleListItem } from "@/lib/articles"
import { getStockLogoUrl } from "@/lib/stock-images"

function getStockLogosForArticle({ tickers }: { tickers: string[] }): Array<{ ticker: string; url: string }> {
  const logos: Array<{ ticker: string; url: string }> = []
  for (const ticker of (tickers ?? []).slice(0, 3)) {
    const url = getStockLogoUrl({ ticker })
    if (url) logos.push({ ticker, url })
  }
  return logos
}

interface NewsArticleCardProps {
  article: ArticleListItem
  size?: "lg" | "md" | "sm"
  className?: string
}

export function NewsArticleCard({ article, size = "md", className = "" }: NewsArticleCardProps) {
  const categoryLabel = getCategoryLabel({ article })
  const readTimeMinutes = getReadTimeMinutes({ title: article.title, excerpt: article.excerpt })
  const sentiment = getSentiment({ seed: article.slug })
  const sparkline = getSparkline({ seed: article.slug, tone: sentiment.tone })
  const stockLogos = getStockLogosForArticle({ tickers: article.tickers })

  const density =
    size === "lg" ? "p-7" : size === "sm" ? "p-5" : "p-6"

  return (
    <Link
      href={`/news/${article.slug}`}
      className={`group relative block overflow-hidden rounded-3xl border border-border bg-surface/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur transition hover:border-accent/35 hover:shadow-[0_0_0_1px_rgba(212,212,212,0.12),0_0_80px_rgba(212,212,212,0.06)] ${density} ${className}`}
      aria-label={article.title}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border-subtle bg-background/60 px-3 py-1 text-[11px] text-foreground-muted">
              {categoryLabel}
            </span>
            <span className="inline-flex items-center rounded-full border border-border-subtle bg-background/60 px-3 py-1 font-mono text-[11px] text-foreground-muted">
              {readTimeMinutes}m
            </span>
            <span
              className={`inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background/60 px-3 py-1 text-[11px] ${
                sentiment.tone === "positive" ? "text-positive" : "text-negative"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  sentiment.tone === "positive" ? "bg-positive" : "bg-negative"
                }`}
                aria-hidden="true"
              />
              {sentiment.label}
            </span>
            <span className="ml-auto hidden font-mono text-[11px] text-foreground-muted sm:inline">
              {formatIsoDate({ iso: article.published_at })}
            </span>
          </div>

          <h2
            className={`mt-4 font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent ${
              size === "lg" ? "text-xl" : "text-base"
            }`}
          >
            {article.title}
          </h2>

          {article.excerpt ? (
            <p
              className={`mt-3 leading-6 text-foreground-muted ${
                size === "lg" ? "text-sm" : "text-sm"
              }`}
            >
              {article.excerpt}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {article.tickers?.slice(0, 3).map((ticker) => (
              <span
                key={ticker}
                className="inline-flex items-center rounded-full bg-accent/12 px-3 py-1 font-mono text-[11px] text-accent"
              >
                {ticker}
              </span>
            ))}
            {article.is_breaking ? (
              <span className="inline-flex items-center rounded-full bg-warning/15 px-3 py-1 text-[11px] text-warning">
                Breaking
              </span>
            ) : null}
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-3 sm:flex">
          {stockLogos.length > 0 ? (
            <div className="flex items-center gap-2">
              {stockLogos.map(({ ticker, url }) => (
                <div
                  key={ticker}
                  className="relative h-10 w-10 overflow-hidden rounded-xl border border-border-subtle bg-white p-1.5"
                  title={ticker}
                >
                  <Image
                    src={url}
                    alt={`${ticker} logo`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-background/50">
              <Building2 className="h-5 w-5 text-foreground-muted" aria-hidden="true" />
            </div>
          )}
          <div className="rounded-2xl border border-border-subtle bg-background/50 p-3">
            <svg
              viewBox={`0 0 ${sparkline.width} ${sparkline.height}`}
              className="h-8 w-28"
              aria-label="Sparkline placeholder"
              role="img"
            >
              <polyline
                points={sparkline.points}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                className={sparkline.tone === "positive" ? "text-positive" : "text-negative"}
              />
            </svg>
          </div>
          <ArrowUpRight
            className="h-4 w-4 text-foreground-muted opacity-0 transition group-hover:opacity-100 group-hover:text-accent"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  )
}

function getCategoryLabel({ article }: { article: ArticleListItem }) {
  if (article.is_breaking) return "Breaking"

  const tag = article.tags?.[0]
  if (!tag) return "News"

  return tag
    .split("-")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ")
}

function getReadTimeMinutes({ title, excerpt }: { title: string; excerpt: string | null }) {
  const source = [title, excerpt].filter(Boolean).join(" ")
  const words = source.split(/\s+/).filter(Boolean).length

  return Math.min(12, Math.max(1, Math.round(words / 22)))
}

function getSentiment({ seed }: { seed: string }) {
  const value = hashStringToNumber({ value: seed })
  const isBullish = value % 2 === 0

  return {
    label: isBullish ? "Bullish" : "Bearish",
    tone: isBullish ? ("positive" as const) : ("negative" as const),
  }
}

function getSparkline({ seed, tone }: { seed: string; tone: "positive" | "negative" }) {
  const width = 112
  const height = 32
  const pointsCount = 14

  const random = mulberry32({ seed: hashStringToNumber({ value: seed }) })
  const values = Array.from({ length: pointsCount }, () => 6 + random() * 20)

  const normalized = normalizeSparkline({ values, height })

  const points = normalized
    .map((value, index) => {
      const x = (index / (pointsCount - 1)) * width
      const y = height - value
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")

  return { width, height, points, tone }
}

function normalizeSparkline({ values, height }: { values: number[]; height: number }) {
  const min = Math.min(...values)
  const max = Math.max(...values)

  if (max === min) return values.map(() => height / 2)

  return values.map((value) => ((value - min) / (max - min)) * (height - 6) + 3)
}

function hashStringToNumber({ value }: { value: string }) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function mulberry32({ seed }: { seed: number }) {
  let t = seed + 0x6d2b79f5

  return function random() {
    t += 0x6d2b79f5

    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)

    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function formatIsoDate({ iso }: { iso: string }) {
  if (!iso) return ""

  const date = new Date(iso)
  const month = date.toLocaleString("en-US", { month: "short" })
  const day = date.toLocaleString("en-US", { day: "2-digit" })

  return `${month} ${day}`
}
