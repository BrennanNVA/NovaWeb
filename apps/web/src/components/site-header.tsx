"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Markets", href: "/markets" },
  { label: "Research", href: "/research" },
  { label: "Analysis", href: "/analysis" },
  { label: "About", href: "/about" },
]

export function SiteHeader() {
  const pathname = usePathname()

  if (pathname.startsWith("/embed/")) return null

  return (
    <header className="sticky top-0 z-50 border-b border-[#3a3a3a] bg-[#111111]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-[#ededed]" aria-label="Nova Aetus Home"
        >
          Nova Aetus
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {NAV_ITEMS.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#ededed]/80 hover:text-[#0A9D8F] transition-colors" aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/about#partners"
            className="rounded-full bg-[#0A9D8F] px-4 py-2 text-sm font-medium text-[#111111] hover:bg-[#0A9D8F]/90 transition-colors" aria-label="Partner with Nova Aetus"
          >
            Partner with us
          </Link>
        </div>
      </div>
    </header>
  )
}
