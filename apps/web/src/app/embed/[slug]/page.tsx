import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getDatasetBySlug, getDatasets } from "@/lib/datasets"

export function generateStaticParams() {
  const datasets = getDatasets()
  return datasets.map((dataset) => ({ slug: dataset.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { dataset } = getDatasetBySlug({ slug })

  if (!dataset) return { title: "Embed" }

  return {
    title: `${dataset.title} (Embed)`,
    description: dataset.summary,
    alternates: {
      canonical: `/research/${dataset.slug}`,
    },
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  }
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { dataset } = getDatasetBySlug({ slug })

  if (!dataset) notFound()

  return (
    <div className="h-full w-full bg-white text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 py-3 dark:border-zinc-900">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{dataset.title}</p>
            <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
              Updated {dataset.updatedAt} · License {dataset.license}
            </p>
          </div>
          <a
            href={`/research/${dataset.slug}`}
            className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            View
          </a>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div className="h-full overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
                <tr>
                  {dataset.preview.columns.map((column) => (
                    <th key={column} scope="col" className="whitespace-nowrap px-3 py-2">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {dataset.preview.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="bg-white dark:bg-black">
                    {dataset.preview.columns.map((column) => (
                      <td key={column} className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-200">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
