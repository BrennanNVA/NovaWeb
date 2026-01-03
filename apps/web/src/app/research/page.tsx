import type { Metadata } from "next"
import Link from "next/link"
import { Database } from "lucide-react"

import { getDatasets } from "@/lib/datasets"

export const metadata: Metadata = {
  title: "Research & Datasets",
  description: "Open-source financial datasets and quantitative research with clear licensing and reproducibility.",
  alternates: {
    canonical: "/research",
  },
}

export default function ResearchPage() {
  const datasets = getDatasets()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-7 w-7 text-accent" aria-hidden="true" />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Research & Datasets
          </h1>
        </div>
        <p className="mt-3 text-lg leading-8 text-foreground-muted">
          Open-source financial datasets and quantitative research with clear licensing and reproducibility.
        </p>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {datasets.map((dataset) => (
          <Link
            key={dataset.slug}
            href={`/research/${dataset.slug}`}
            className="block rounded-xl border border-border bg-surface p-6 transition hover:border-accent/50 hover:bg-surface-elevated"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-base font-semibold text-foreground">
                  {dataset.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  {dataset.summary}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground-muted">
                Updated {dataset.updatedAt}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
              <span className="rounded-full border border-border px-3 py-1">License {dataset.license}</span>
              {dataset.datasetFiles.map((file) => (
                <span key={file.label} className="rounded-full bg-accent/20 px-3 py-1 text-accent">
                  {file.label}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
