import type { Metadata } from "next"
import Link from "next/link"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { CopyableCodeBlock } from "@/components/copyable-code-block"
import { getLatestDataset } from "@/lib/datasets"

export const metadata: Metadata = {
  title: "Tools & Examples",
  description: "Code examples, API snippets, and developer tools for integrating Nova Aetus financial data.",
  alternates: {
    canonical: "/tools",
  },
}

export default function ToolsPage() {
  const { dataset } = getLatestDataset()

  const datasetHref = dataset?.datasetFiles.at(0)?.href ?? ""
  const datasetSlug = dataset?.slug ?? ""
  const datasetTitle = dataset?.title ?? "Latest dataset"

  const pythonCode = datasetHref
    ? [
        "import pandas as pd",
        "",
        `url = \"https://www.novaaetus.com${datasetHref}\"`,
        "df = pd.read_csv(url)",
        "print(df.head())",
      ].join("\n")
    : ""

  const rCode = datasetHref
    ? [
        "library(readr)",
        "",
        `df <- read_csv(\"https://www.novaaetus.com${datasetHref}\")`,
        "head(df)",
      ].join("\n")
    : ""

  const javascriptCode = datasetHref
    ? [
        `const res = await fetch(\"https://www.novaaetus.com${datasetHref}\")`,
        "const csv = await res.text()",
        "console.log(csv.split(\"\\n\").slice(0, 6).join(\"\\n\"))",
      ].join("\n")
    : ""

  const shellCode = datasetHref
    ? [
        `curl -L -o dataset.csv https://www.novaaetus.com${datasetHref}`,
        "",
        "# Preview the first 5 lines",
        "head -n 5 dataset.csv",
      ].join("\n")
    : ""

  const embedCode = datasetSlug
    ? [
        "<iframe",
        `  src=\"https://www.novaaetus.com/embed/${datasetSlug}\"`,
        "  width=\"640\"",
        "  height=\"360\"",
        "  loading=\"lazy\"",
        "  style=\"border:0\"",
        "></iframe>",
      ].join("\n")
    : ""

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Tools & Examples
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Copy/paste examples to download datasets, run local analysis, and embed lightweight
          previews.
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Local-first</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Download the CSV once, keep it in version control, and reproduce results offline.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Copyable snippets</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Every example is designed to work without API keys or proprietary clients.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Embeddable widgets</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Share dataset previews in docs, wikis, and internal dashboards.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Try it with {datasetTitle}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Start with the latest dataset release.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4">
            {shellCode ? <CopyableCodeBlock code={shellCode} language="Shell" /> : null}
            {pythonCode ? <CopyableCodeBlock code={pythonCode} language="Python" /> : null}
          </div>
          <div className="grid gap-4">
            {rCode ? <CopyableCodeBlock code={rCode} language="R" /> : null}
            {javascriptCode ? (
              <CopyableCodeBlock code={javascriptCode} language="JavaScript" />
            ) : null}
          </div>
        </div>

        {embedCode ? (
          <div className="mt-6">
            <CopyableCodeBlock code={embedCode} language="HTML" />
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {datasetSlug ? (
            <Link
              href={`/research/${datasetSlug}`}
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-white"
            >
              View dataset
            </Link>
          ) : null}
          <Link
            href="/research"
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Browse all datasets
          </Link>
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>
    </div>
  )
}
