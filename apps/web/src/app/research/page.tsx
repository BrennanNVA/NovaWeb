import type { Metadata } from "next"
import Link from "next/link"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { getDatasets } from "@/lib/datasets"

export const metadata: Metadata = {
  title: "Research & Datasets",
}

export default function ResearchPage() {
  const datasets = getDatasets()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Research & Datasets
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Download datasets and supporting metadata. Every release includes clear licensing and
          reproducibility links.
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {datasets.map((dataset) => (
          <Link
            key={dataset.slug}
            href={`/research/${dataset.slug}`}
            className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-900 dark:bg-zinc-950 dark:hover:border-zinc-800"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  {dataset.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {dataset.summary}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                Updated {dataset.updatedAt}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <span>License {dataset.license}</span>
              <span>{dataset.datasetFiles.map((file) => file.label).join(" · ")}</span>
            </div>
          </Link>
        ))}
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>
    </div>
  )
}
