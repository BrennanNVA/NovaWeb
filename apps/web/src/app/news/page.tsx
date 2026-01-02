import type { Metadata } from "next"
import Link from "next/link"

import { getPublishedArticles } from "@/lib/articles"
import { SearchBar } from "@/components/search-bar"

export const metadata: Metadata = {
  title: "News",
}

export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const { articles } = await getPublishedArticles({ limit: 30 })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[#ededed] sm:text-4xl">
          Financial News
        </h1>
        <p className="mt-3 text-lg leading-8 text-[#ededed]/80">
          AI-generated market updates and breaking coverage across our tracked tickers.
        </p>
        <div className="mt-6">
          <SearchBar placeholder="Search news articles..." />
        </div>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {articles.length ? (
          articles.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="block rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-6 shadow-sm transition hover:border-[#0A9D8F]/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-[#ededed]">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mt-2 text-sm leading-6 text-[#ededed]/70">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full border border-[#3a3a3a] bg-[#111111] px-3 py-1 text-xs text-[#ededed]/60">
                  {getIsoDateLabel({ iso: article.published_at })}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {article.is_breaking && (
                  <span className="rounded-full bg-[#E9B44C]/20 px-3 py-1 text-xs font-medium text-[#E9B44C]">
                    Breaking
                  </span>
                )}
                {article.tickers?.length > 0 && article.tickers.map((ticker) => (
                  <span key={ticker} className="rounded-full bg-[#0A9D8F]/20 px-3 py-1 text-xs font-medium text-[#0A9D8F]">
                    {ticker}
                  </span>
                ))}
                {article.tags?.length > 0 && article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-[#3a3a3a] px-3 py-1 text-xs text-[#ededed]/60">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 rounded-2xl border border-[#3a3a3a] bg-[#2B2B2B] p-8 text-center text-sm text-[#ededed]/60 shadow-sm">
            No published articles yet. Check back soon!
          </div>
        )}
      </section>
    </div>
  )
}

function getIsoDateLabel({ iso }: { iso: string }) {
  if (!iso) return ""

  return iso.slice(0, 10)
}
