import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { CopyableCodeBlock } from "@/components/copyable-code-block"
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

  if (!dataset) return { title: "Model card" }

  return {
    title: `Model card: ${dataset.title}`,
    description: dataset.summary,
    alternates: {
      canonical: `/reproducibility/model-card/${dataset.slug}`,
    },
  }
}

export default async function ModelCardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { dataset } = getDatasetBySlug({ slug })

  if (!dataset) notFound()

  const quickstartCode = getQuickstartCode({
    datasetHref: dataset.datasetFiles.at(0)?.href ?? "",
    metadataHref: dataset.metadataFile.href,
  })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/reproducibility"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to Reproducibility
        </Link>
      </div>

      <header className="mt-6 max-w-2xl">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Model card</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {dataset.title}
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          {dataset.summary}
        </p>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Updated {dataset.updatedAt} · License {dataset.license}
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Intended use</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
              <li>Educational demos and lightweight benchmarking.</li>
              <li>Prototyping workflows that need a small, human-readable dataset.</li>
              <li>Teaching reproducible analysis with a clear license and provenance file.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Out of scope / limitations
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
              <li>Not a substitute for large-scale, production-grade datasets.</li>
              <li>Values are examples and may not reflect real-world distributions.</li>
              <li>Always confirm suitability before using in safety-critical contexts.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Data sources</h2>
            <div className="mt-4 grid gap-2">
              {dataset.sources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target={doesHrefLookExternal({ href: source.href }) ? "_blank" : undefined}
                  rel={doesHrefLookExternal({ href: source.href }) ? "noopener noreferrer" : undefined}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Quickstart (download locally)
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              These commands download the dataset and its provenance metadata.
            </p>
            <div className="mt-4">
              <CopyableCodeBlock code={quickstartCode} language="Shell" />
            </div>
          </section>
        </div>

        <aside className="grid gap-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Downloads
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {dataset.datasetFiles.map((file) => (
                <a
                  key={file.href}
                  href={file.href}
                  download
                  className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-white"
                >
                  {file.label}
                </a>
              ))}
              <a
                href={dataset.metadataFile.href}
                download
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Metadata JSON
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Related</h2>
            <div className="mt-4 grid gap-2">
              <Link
                href={`/reproducibility/datasheet/${dataset.slug}`}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Datasheet
              </Link>
              <Link
                href={`/research/${dataset.slug}`}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Dataset page
              </Link>
            </div>
          </section>
        </aside>
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>
    </div>
  )
}

function doesHrefLookExternal({ href }: { href: string }) {
  return href.startsWith("http://") || href.startsWith("https://")
}

function getQuickstartCode({
  datasetHref,
  metadataHref,
}: {
  datasetHref: string
  metadataHref: string
}) {
  return [
    `curl -L -o dataset.csv https://www.novaaetus.com${datasetHref}`,
    `curl -L -o metadata.json https://www.novaaetus.com${metadataHref}`,
  ].filter(Boolean).join("\n")
}
