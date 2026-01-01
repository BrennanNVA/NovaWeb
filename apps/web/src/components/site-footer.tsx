"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith("/embed/")) return null

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-900 dark:bg-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/legal" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Legal
          </Link>
          <Link href="/legal#privacy" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Privacy
          </Link>
          <Link href="/legal#licensing" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Licensing
          </Link>
          <Link href="/about" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            About
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Nova Aetus. Free, open-data research.</p>
      </div>
    </footer>
  )
}
