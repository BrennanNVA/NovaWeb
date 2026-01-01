import type { Metadata } from "next"
import Link from "next/link"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { getPublishedArticles } from "@/lib/articles"

export const metadata: Metadata = {
  title: "News",
}

export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const { articles } = await getPublishedArticles({ limit: 30 })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          News
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Automated market updates and breaking coverage across our tracked tickers.
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {articles.length ? (
          articles.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-900 dark:bg-zinc-950 dark:hover:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    {article.title}
                  </h2>
                  {article.excerpt ? (
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {article.excerpt}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  {getIsoDateLabel({ iso: article.published_at })}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                {article.is_breaking ? (
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                    Breaking
                  </span>
                ) : null}
                {article.tickers?.length ? <span>{article.tickers.join(" · ")}</span> : null}
                {article.tags?.length ? <span>{article.tags.join(" · ")}</span> : null}
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-400">
            No published articles yet.
          </div>
        )}
      </section>

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
