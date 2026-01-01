"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Research & Datasets", href: "/research" },
  { label: "Reproducibility", href: "/reproducibility" },
  { label: "Tools & Examples", href: "/tools" },
  { label: "Repos & Embeds", href: "/repos" },
  { label: "About / Partners", href: "/about" },
  { label: "Legal", href: "/legal" },
]

export function SiteHeader() {
  const pathname = usePathname()

  if (pathname.startsWith("/embed/")) return null

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-900 dark:bg-black/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          Nova Aetus
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {NAV_ITEMS.slice(1, 7).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/about#partners"
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-white"
          >
            Partner with us
          </Link>
        </div>
      </div>
    </header>
  )
}
