"use client"

import { useMemo, useState } from "react"

export interface CopyableCodeBlockProps {
  code: string
  language?: string
}

export function CopyableCodeBlock({ code, language }: CopyableCodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const buttonLabel = useMemo(() => {
    if (hasCopied) return "Copied"
    return "Copy"
  }, [hasCopied])

  async function onCopy() {
    if (!navigator?.clipboard?.writeText) return

    await navigator.clipboard.writeText(code)

    setHasCopied(true)
    window.setTimeout(() => setHasCopied(false), 1200)
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          {language ?? "Code"}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          {buttonLabel}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-sm leading-6">
        <code className="text-zinc-900 dark:text-zinc-50">{code}</code>
      </pre>
    </section>
  )
}
