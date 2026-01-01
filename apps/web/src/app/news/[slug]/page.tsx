import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
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
          className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to News
        </Link>
      </div>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {article.title}
        </h1>
        {article.excerpt ? (
          <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            {article.excerpt}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <span>Published {getIsoDateLabel({ iso: article.published_at })}</span>
          {article.is_breaking ? <span>Breaking</span> : null}
          {article.tickers?.length ? <span>{article.tickers.join(" · ")}</span> : null}
        </div>
      </header>

      <article className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950 sm:p-8">
        <pre className="whitespace-pre-wrap text-sm leading-7 text-zinc-800 dark:text-zinc-200">
          {article.body_markdown}
        </pre>
      </article>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>
    </div>
  )
}

function getIsoDateLabel({ iso }: { iso: string }) {
  if (!iso) return ""

  return iso.slice(0, 10)
}
