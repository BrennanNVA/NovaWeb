import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About / Partners",
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          About Nova Aetus
        </h1>
        <p className="mt-3 text-lg leading-8 text-foreground-muted">
          Nova Aetus is a research-first publisher focused on free, open datasets, reproducibility
          artifacts, and embeddable previews.
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-foreground">Open by default</h2>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            No subscriptions, no API keys, and no paywalls—datasets are available as direct
            downloads.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-foreground">
            Reproducible artifacts
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            Model cards, datasheets, and provenance metadata ship alongside every dataset.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-foreground">Ad-supported</h2>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            Advertising keeps the site free. We use reserved ad slots to protect layout stability.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-surface p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What we publish
        </h2>
        <p className="mt-3 text-sm leading-6 text-foreground-muted">
          The focus is practical: datasets you can download, cite, and embed without friction.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/research"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Browse datasets
          </Link>
          <Link
            href="/reproducibility"
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground hover:bg-surface-elevated"
          >
            View reproducibility
          </Link>
          <Link
            href="/legal"
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground hover:bg-surface-elevated"
          >
            Legal & licensing
          </Link>
        </div>
      </section>

      <section
        id="partners"
        className="mt-10 rounded-xl border border-border bg-surface p-8"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Partner with us
        </h2>
        <p className="mt-3 text-sm leading-6 text-foreground-muted">
          We collaborate with organizations that want their datasets to be published with clear
          licensing, strong documentation, and embedded previews.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold text-foreground">Sponsors</h3>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              Support publication and hosting costs while keeping datasets free for everyone.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold text-foreground">Publishers</h3>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              Work with us to ship a dataset package (CSV + metadata + model card + datasheet).
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-foreground-muted">
          Interested in partnering? Reach out via our social channels or through the contact form on our website.
        </p>
      </section>
    </div>
  )
}
