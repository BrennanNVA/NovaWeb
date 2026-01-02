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
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A9D8F] hover:text-[#0A9D8F]/80 transition-colors"
          aria-label="Back to news listing"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to News
        </Link>
      </div>

      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {article.is_breaking && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E9B44C]/20 px-3 py-1 text-xs font-medium text-[#E9B44C]">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Breaking News
            </span>
          )}
          {article.tickers?.length > 0 && article.tickers.map((ticker) => (
            <span key={ticker} className="rounded-full bg-[#0A9D8F]/20 px-3 py-1 text-xs font-medium text-[#0A9D8F]">
              {ticker}
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl font-semibold tracking-tight text-[#ededed] sm:text-4xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-3 text-lg leading-8 text-[#ededed]/80">
            {article.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 text-sm text-[#ededed]/60">
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

      <article className="mt-8 rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-6 shadow-sm sm:p-8">
        <div className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap text-sm leading-7 text-[#ededed]/90 font-sans">
{article.body_markdown}
          </pre>
        </div>
      </article>

      {article.tags && article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-[#ededed]/60">Tags:</span>
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[#3a3a3a] px-3 py-1 text-xs text-[#ededed]/60">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
