import type { Metadata } from "next"

import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"

export const metadata: Metadata = {
  title: "Legal & Privacy",
  description: "Plain-language policies, privacy information, and licensing guidance for Nova Aetus.",
  alternates: {
    canonical: "/legal",
  },
}

export default function LegalPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Legal
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Plain-language policies and licensing guidance for Nova Aetus.
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Terms</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
            Datasets and pages are provided “as is”. You are responsible for verifying suitability,
            accuracy, and compliance for your use case.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
            <li>Do not rely on sample datasets for safety-critical decisions.</li>
            <li>Follow the license specified on each dataset page.</li>
            <li>Respect attribution requirements where applicable.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Advertising</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
            Nova Aetus is supported by advertising. We reserve ad space to prevent layout shifts.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
            <li>Ads are not shown inside code blocks.</li>
            <li>Embedded widgets hide global navigation.</li>
            <li>You can use browser tools and extensions to block ads if desired.</li>
          </ul>
        </section>
      </section>

      <section
        id="privacy"
        className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Privacy
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
          We aim to collect minimal information needed to operate the site. Like most websites,
          infrastructure logs may include IP address, user agent, and request metadata.
        </p>
        <p className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
          Third-party advertising partners may set cookies or use similar technologies to measure
          impressions and reduce fraud. You can control cookies in your browser settings.
        </p>
      </section>

      <section
        id="licensing"
        className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Licensing
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
          Each dataset page lists a license (for example CC BY 4.0). The license applies to that
          dataset package (CSV + metadata + documentation) unless stated otherwise.
        </p>
        <p className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
          If you redistribute datasets, keep license information and citations intact.
        </p>
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraNativeBanner />
      </div>
    </div>
  )
}
