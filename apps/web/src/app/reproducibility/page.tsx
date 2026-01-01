import type { Metadata } from "next"
import Link from "next/link"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { getDatasets } from "@/lib/datasets"

export const metadata: Metadata = {
  title: "Reproducibility",
}

export default function ReproducibilityPage() {
  const datasets = getDatasets()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Reproducibility
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Every dataset ships with artifacts designed for re-use and verification: model cards,
          datasheets, provenance metadata, and copyable code examples.
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Model cards</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Plain-language summaries of intended use, limitations, licensing, and how to reproduce
            results.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Datasheets</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Structured documentation covering motivation, collection, cleaning steps, and ethical
            considerations.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Provenance</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            A downloadable JSON file describing sources, timestamps, and distribution information.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Artifact index
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Pick a dataset to view its reproducibility artifacts.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {datasets.map((dataset) => (
            <div
              key={dataset.slug}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            >
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                {dataset.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {dataset.summary}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href={`/reproducibility/model-card/${dataset.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-white"
                >
                  Model card
                </Link>
                <Link
                  href={`/reproducibility/datasheet/${dataset.slug}`}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Datasheet
                </Link>
                <Link
                  href={`/research/${dataset.slug}`}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Dataset page
                </Link>
                <a
                  href={dataset.metadataFile.href}
                  download
                  className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Metadata JSON
                </a>
              </div>
              <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
                Updated {dataset.updatedAt} · License {dataset.license}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>
    </div>
  )
}
