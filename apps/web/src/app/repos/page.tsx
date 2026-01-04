import type { Metadata } from "next"
import Link from "next/link"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { CopyableCodeBlock } from "@/components/copyable-code-block"
import { getDatasets } from "@/lib/datasets"

export const metadata: Metadata = {
  title: "Repos & Embeds",
  description: "GitHub repositories, embeddable widgets, and integration guides for Nova Aetus datasets.",
  alternates: {
    canonical: "/repos",
  },
}

export default function ReposPage() {
  const datasets = getDatasets()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Repos & Embeds
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Embed dataset previews, share reproducibility artifacts, and link out to related
          repositories.
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Embeddable widgets
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Use the embed routes to display a compact preview table and quick links.
          </p>
          <div className="mt-4 grid gap-4">
            {datasets.map((dataset) => (
              <div key={dataset.slug} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {dataset.title}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">/embed/{dataset.slug}</p>
                </div>
                <div className="mt-3">
                  <CopyableCodeBlock
                    code={getEmbedCode({ slug: dataset.slug, width: dataset.embed.width, height: dataset.embed.height })}
                    language="HTML"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/embed/${dataset.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-white"
                  >
                    Preview embed
                  </Link>
                  <Link
                    href={`/research/${dataset.slug}`}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                  >
                    Dataset page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              About Embeds
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Embed our dataset previews directly into your documentation, research papers, or internal dashboards using the iframe code provided.
            </p>
            <div className="mt-4 grid gap-2">
              <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                All embeds are responsive and load asynchronously
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                Data updates automatically when source datasets change
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                Attribution is included in the embed footer
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Embed guidelines
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
              <li>Prefer the embed route for lightweight previews.</li>
              <li>Use dataset pages for full downloads, metadata, and reproducibility links.</li>
              <li>Keep attribution intact when sharing externally.</li>
            </ul>
          </section>
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>
    </div>
  )
}

function getEmbedCode({
  slug,
  width,
  height,
}: {
  slug: string
  width: number
  height: number
}) {
  return [
    "<iframe",
    `  src=\"https://www.novaaetus.com/embed/${slug}\"`,
    `  width=\"${width}\"`,
    `  height=\"${height}\"`,
    "  loading=\"lazy\"",
    "  style=\"border:0\"",
    "></iframe>",
  ].join("\n")
}
