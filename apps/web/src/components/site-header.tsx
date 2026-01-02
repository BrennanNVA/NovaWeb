"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Newspaper } from "lucide-react"

import { CommandK } from "@/components/command-k"

const NAV_ITEMS = [
  { label: "News", href: "/news" },
  { label: "Markets", href: "/markets" },
  { label: "Analysis", href: "/analysis" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
]

export function SiteHeader() {
  const pathname = usePathname()

  if (pathname.startsWith("/embed/")) return null

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Nova Aetus Home"
          >
            <Newspaper className="h-5 w-5 text-accent" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Nova Aetus
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-foreground-muted hover:text-foreground hover:bg-surface"
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <CommandK />
          <Link
            href="/about#partners"
            className="hidden rounded-md bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent/90 transition-colors sm:inline-flex"
            aria-label="Partner with Nova Aetus"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  )
}
