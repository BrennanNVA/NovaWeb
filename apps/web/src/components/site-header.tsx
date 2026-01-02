"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { CommandK } from "@/components/command-k"
import { PulseBar } from "@/components/pulse-bar"

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
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur">
      <PulseBar />
      <div className="border-b border-border bg-background/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-foreground" aria-label="Nova Aetus Home"
            >
              Nova Aetus
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              {NAV_ITEMS.slice(1).map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive
                        ? "text-sm font-medium text-accent"
                        : "text-sm text-foreground-muted hover:text-foreground transition-colors"
                    }
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <CommandK />
            <Link
              href="/about#partners"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent/90 transition-colors sm:inline-flex"
              aria-label="Partner with Nova Aetus"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
