import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react"

import { getPublishedArticleBySlug } from "@/lib/articles"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { article } = await getPublishedArticleBySlug({ slug })

  if (!article) return { title: "News" }

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
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
        <div className="flex flex-wrap items-center gap-2 mb-4">
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
        <div className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap text-sm leading-7 text-foreground font-sans">
{article.body_markdown}
          </pre>
        </div>
      </article>

      {article.tags && article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-foreground-muted">Tags:</span>
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border-subtle bg-background/40 px-3 py-1 text-xs text-foreground-muted">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
