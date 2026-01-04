import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, TrendingUp, Building2 } from "lucide-react"

import { getPublishedArticleBySlug } from "@/lib/articles"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { getStockLogoUrl } from "@/lib/stock-images"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { article } = await getPublishedArticleBySlug({ slug })

  if (!article) return { title: "News" }

  const description = article.excerpt ?? `Read the latest analysis on ${article.tickers?.join(", ") || "financial markets"} from Nova Aetus.`

  return {
    title: article.title,
    description,
    alternates: {
      canonical: `/news/${slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      publishedTime: article.published_at,
      authors: ["Nova Aetus"],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { article } = await getPublishedArticleBySlug({ slug })

  if (!article) notFound()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          aria-label="Back to news listing"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to News
        </Link>
      </div>

      <header className="mt-6 max-w-3xl">
        <div className="flex items-start gap-4 mb-4">
          {/* Stock logos */}
          <div className="flex items-center gap-2 shrink-0">
            {article.tickers?.slice(0, 3).map((ticker) => {
              const logoUrl = getStockLogoUrl({ ticker })
              return logoUrl ? (
                <div
                  key={ticker}
                  className="relative h-12 w-12 overflow-hidden rounded-xl border border-border-subtle bg-white p-1.5"
                  title={ticker}
                >
                  <Image
                    src={logoUrl}
                    alt={`${ticker} logo`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div
                  key={ticker}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-subtle bg-background/50"
                  title={ticker}
                >
                  <Building2 className="h-6 w-6 text-foreground-muted" aria-hidden="true" />
                </div>
              )
            })}
            {(!article.tickers || article.tickers.length === 0) && (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-subtle bg-background/50">
                <Building2 className="h-6 w-6 text-foreground-muted" aria-hidden="true" />
              </div>
            )}
          </div>
          
          {/* Tags and badges */}
          <div className="flex flex-wrap items-center gap-2">
            {article.is_breaking && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                Breaking News
              </span>
            )}
            {article.tickers?.length > 0 && article.tickers.map((ticker) => (
              <span key={ticker} className="rounded-full bg-accent/12 px-3 py-1 text-xs font-medium text-accent font-mono">
                {ticker}
              </span>
            ))}
          </div>
        </div>
        
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-3 text-lg leading-8 text-foreground-muted">
            {article.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 text-sm text-foreground-muted font-mono">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <time dateTime={article.published_at}>
            {new Date(article.published_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      </header>

      <article className="mt-8 rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-8">
        <MarkdownRenderer content={article.body_markdown} />
      </article>

      {article.tags && article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-foreground-muted">Tags:</span>
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/news?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-border-subtle bg-background/40 px-3 py-1 text-xs text-foreground-muted hover:border-accent/30 hover:text-accent transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
