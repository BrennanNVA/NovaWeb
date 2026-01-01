import Image from "next/image"
import Link from "next/link"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { getDatasets, getLatestDataset } from "@/lib/datasets"

export default function HomePage() {
  const { dataset: latestDataset } = getLatestDataset()
  const datasets = getDatasets()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-900 dark:bg-zinc-950 sm:p-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <Image
                src="/globe.svg"
                alt=""
                width={28}
                height={28}
                className="dark:invert"
              />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Free, open-data research
              </p>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Datasets, provenance, and reproducible artifacts—no keys, no paywalls.
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Nova Aetus publishes research-first datasets with clear licensing, reproducibility
              links, embeddable widgets, and copyable code examples.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/research"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-white"
              >
                Browse datasets
              </Link>
              <Link
                href="/reproducibility"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Reproducibility
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-left shadow-sm dark:border-zinc-900 dark:bg-black">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Latest dataset
            </p>
            {latestDataset ? (
              <div className="mt-3 grid gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    {latestDataset.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {latestDataset.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <span>Updated {latestDataset.updatedAt}</span>
                  <span>License {latestDataset.license}</span>
                </div>
                <Link
                  href={`/research/${latestDataset.slug}`}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                >
                  View dataset
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                New releases coming soon.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Downloadable datasets
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Grab CSVs and metadata directly—optimized for analysis and archiving.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Reproducibility artifacts
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Model cards, datasheets, provenance, and transparent sourcing in one place.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Embeds and examples
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Share widgets and copy code snippets for local, offline, and classroom use.
          </p>
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>

      <section className="mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Explore datasets
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Free to use. Clear license. Easy to reproduce.
            </p>
          </div>
          <Link
            href="/research"
            className="text-sm font-medium text-zinc-900 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
          >
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {datasets.slice(0, 2).map((dataset) => (
            <Link
              key={dataset.slug}
              href={`/research/${dataset.slug}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-900 dark:bg-zinc-950 dark:hover:border-zinc-800"
            >
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                {dataset.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {dataset.summary}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                <span>Updated {dataset.updatedAt}</span>
                <span>License {dataset.license}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
