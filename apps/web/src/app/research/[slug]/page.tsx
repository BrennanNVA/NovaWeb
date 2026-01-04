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

  if (!dataset) return { title: "Dataset" }

  return {
    title: dataset.title,
    description: dataset.summary,
    alternates: {
      canonical: `/research/${dataset.slug}`,
    },
  }
}

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { dataset } = getDatasetBySlug({ slug })

  if (!dataset) notFound()

  const embedCode = getEmbedCode({ src: dataset.embed.src, height: dataset.embed.height, width: dataset.embed.width })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/research"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to Research & Datasets
        </Link>
      </div>

      <header className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {dataset.title}
          </h1>
          <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            {dataset.summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Updated {dataset.updatedAt}</span>
            <span>License {dataset.license}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Downloads</p>
          <div className="mt-3 flex flex-wrap gap-2">
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
              {dataset.metadataFile.label}
            </a>
          </div>
        </div>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Preview</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            A small slice of the dataset for quick inspection.
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600 dark:bg-black dark:text-zinc-400">
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
                  <tr key={rowIndex} className="bg-white dark:bg-zinc-950">
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

        <div className="grid gap-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Reproducibility
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Supporting artifacts and documentation.
            </p>
            <div className="mt-4 grid gap-2">
              {dataset.reproducibility.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Sources</h2>
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
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Embed</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Use this iframe snippet to embed a lightweight widget.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
            <iframe
              title={`${dataset.title} embed`}
              src={dataset.embed.src}
              width={dataset.embed.width}
              height={dataset.embed.height}
              loading="lazy"
              className="block w-full"
            />
          </div>
          <div className="mt-4">
            <CopyableCodeBlock code={embedCode} language="HTML" />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Code examples</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Copy/paste examples for local, offline, or classroom use.
          </p>
          <div className="mt-4 grid gap-4">
            {dataset.codeExamples.map((example) => (
              <CopyableCodeBlock
                key={example.language}
                code={example.code}
                language={example.language}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function doesHrefLookExternal({ href }: { href: string }) {
  return href.startsWith("http://") || href.startsWith("https://")
}

function getEmbedCode({
  src,
  height,
  width,
}: {
  src: string
  width: number
  height: number
}) {
  return [
    `<iframe`,
    `  src="https://www.novaaetus.com${src}"`,
    `  width="${width}"`,
    `  height="${height}"`,
    `  loading="lazy"`,
    `  style="border:0"`,
    `></iframe>`,
  ].join("\n")
}
