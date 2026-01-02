import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-lg leading-8 text-foreground-muted">
          The page you’re looking for doesn’t exist (or may have moved).
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Go home
          </Link>
          <Link
            href="/research"
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground hover:bg-surface-elevated"
          >
            Browse datasets
          </Link>
        </div>
      </div>
    </div>
  )
}
