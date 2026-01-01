export interface DatasetFile {
  label: string
  href: string
}

export interface DatasetLink {
  label: string
  href: string
}

export interface DatasetPreview {
  columns: string[]
  rows: Array<Record<string, string>>
}

export interface DatasetCodeExample {
  language: "Python" | "R" | "JavaScript"
  code: string
}

export interface Dataset {
  slug: string
  title: string
  summary: string
  updatedAt: string
  license: string
  datasetFiles: DatasetFile[]
  metadataFile: DatasetFile
  sources: DatasetLink[]
  reproducibility: DatasetLink[]
  preview: DatasetPreview
  codeExamples: DatasetCodeExample[]
  embed: {
    src: string
    width: number
    height: number
  }
}

export function getDatasets() {
  return DATASETS
}

export function getDatasetBySlug({ slug }: { slug: string }) {
  const dataset = DATASETS.find((item) => item.slug === slug)
  return { dataset }
}

export function getLatestDataset() {
  const datasets = getDatasets()

  const latest = datasets
    .slice()
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .at(0)

  return { dataset: latest }
}

const DATASETS: Dataset[] = [
  {
    slug: "sample-weather-daily",
    title: "Sample Weather Daily",
    summary:
      "A small, public demo dataset of daily observations with a companion provenance file.",
    updatedAt: "2025-12-31",
    license: "CC BY 4.0",
    datasetFiles: [{ label: "CSV", href: "/datasets/sample-weather-daily.csv" }],
    metadataFile: {
      label: "Metadata (JSON)",
      href: "/datasets/sample-weather-daily.metadata.json",
    },
    sources: [
      { label: "Example Source A", href: "https://example.com" },
      { label: "Example Source B", href: "https://example.com" },
    ],
    reproducibility: [
      {
        label: "Model card",
        href: "/reproducibility/model-card/sample-weather-daily",
      },
      {
        label: "Datasheet",
        href: "/reproducibility/datasheet/sample-weather-daily",
      },
      {
        label: "Provenance metadata",
        href: "/datasets/sample-weather-daily.metadata.json",
      },
    ],
    preview: {
      columns: ["date", "city", "tmax_c", "tmin_c"],
      rows: [
        { date: "2025-12-27", city: "Boston", tmax_c: "6.2", tmin_c: "-2.1" },
        { date: "2025-12-28", city: "Boston", tmax_c: "4.8", tmin_c: "-3.6" },
        { date: "2025-12-29", city: "Boston", tmax_c: "5.1", tmin_c: "-1.9" },
      ],
    },
    codeExamples: [
      {
        language: "Python",
        code: [
          "import pandas as pd",
          "",
          'url = "https://novaaetus.com/datasets/sample-weather-daily.csv"',
          "df = pd.read_csv(url)",
          "print(df.head())",
        ].join("\n"),
      },
      {
        language: "R",
        code: [
          "library(readr)",
          "",
          'df <- read_csv("https://novaaetus.com/datasets/sample-weather-daily.csv")',
          "head(df)",
        ].join("\n"),
      },
      {
        language: "JavaScript",
        code: [
          'const res = await fetch("https://novaaetus.com/datasets/sample-weather-daily.csv")',
          "const text = await res.text()",
          "const preview = text.split(\"\\n\").slice(0, 6).join(\"\\n\")",
          "console.log(preview)",
        ].join("\n"),
      },
    ],
    embed: {
      src: "/embed/sample-weather-daily",
      width: 640,
      height: 360,
    },
  },
  {
    slug: "sample-market-indicators",
    title: "Sample Market Indicators",
    summary:
      "A small, public demo dataset showing simple market indicators and a reproducibility artifact set.",
    updatedAt: "2025-12-20",
    license: "CC BY 4.0",
    datasetFiles: [{ label: "CSV", href: "/datasets/sample-market-indicators.csv" }],
    metadataFile: {
      label: "Metadata (JSON)",
      href: "/datasets/sample-market-indicators.metadata.json",
    },
    sources: [{ label: "Example Source", href: "https://example.com" }],
    reproducibility: [
      {
        label: "Model card",
        href: "/reproducibility/model-card/sample-market-indicators",
      },
      {
        label: "Datasheet",
        href: "/reproducibility/datasheet/sample-market-indicators",
      },
      {
        label: "Provenance metadata",
        href: "/datasets/sample-market-indicators.metadata.json",
      },
    ],
    preview: {
      columns: ["date", "ticker", "close", "volume"],
      rows: [
        { date: "2025-12-16", ticker: "ACME", close: "101.2", volume: "120034" },
        { date: "2025-12-17", ticker: "ACME", close: "99.8", volume: "98012" },
        { date: "2025-12-18", ticker: "ACME", close: "103.4", volume: "132410" },
      ],
    },
    codeExamples: [
      {
        language: "Python",
        code: [
          "import pandas as pd",
          "",
          'url = "https://novaaetus.com/datasets/sample-market-indicators.csv"',
          "df = pd.read_csv(url)",
          "print(df.tail())",
        ].join("\n"),
      },
      {
        language: "R",
        code: [
          "library(readr)",
          "",
          'df <- read_csv("https://novaaetus.com/datasets/sample-market-indicators.csv")',
          "tail(df)",
        ].join("\n"),
      },
      {
        language: "JavaScript",
        code: [
          'const res = await fetch("https://novaaetus.com/datasets/sample-market-indicators.csv")',
          "const text = await res.text()",
          "console.log(text.split(\"\\n\").slice(0, 6).join(\"\\n\"))",
        ].join("\n"),
      },
    ],
    embed: {
      src: "/embed/sample-market-indicators",
      width: 640,
      height: 360,
    },
  },
]
