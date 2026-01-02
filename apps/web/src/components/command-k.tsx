"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowUpRight } from "lucide-react"

interface CommandKProps {
  className?: string
}

export function CommandK({ className = "" }: CommandKProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const trimmedQuery = query.trim()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const hasCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"
      if (hasCommandK) {
        event.preventDefault()
        setIsOpen(true)
      }

      if (event.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    setQuery("")
    setResponse(null)

    const raf = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(raf)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    if (!trimmedQuery) {
      setResponse(null)
      return
    }

    if (trimmedQuery.length < 2) {
      setResponse(null)
      return
    }

    let isCancelled = false

    setIsLoading(true)

    const timeout = window.setTimeout(async () => {
      try {
        const result = await fetchSearch({ query: trimmedQuery })
        if (isCancelled) return

        setResponse(result)
      } catch {
        if (isCancelled) return

        setResponse({ tickers: [], articles: [] })
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }, 180)

    return () => {
      isCancelled = true
      window.clearTimeout(timeout)
    }
  }, [isOpen, trimmedQuery])

  const quickLinks = useMemo(() => {
    return [
      { label: "News", href: "/news" },
      { label: "Research", href: "/research" },
      { label: "Reproducibility", href: "/reproducibility" },
      { label: "Tools", href: "/tools" },
    ]
  }, [])

  function closePalette() {
    setIsOpen(false)
  }

  function onNavigate({ href }: { href: string }) {
    closePalette()
    router.push(href)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group inline-flex items-center gap-3 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm text-foreground-muted shadow-sm backdrop-blur transition hover:border-accent/40 hover:text-foreground ${className}`}
        aria-label="Open search"
      >
        <Search className="h-4 w-4 text-foreground-muted group-hover:text-accent" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <span className="hidden items-center gap-1 rounded-full border border-border-subtle bg-background/60 px-2 py-0.5 font-mono text-[10px] text-foreground-muted sm:inline-flex">
          <span className="hidden md:inline">⌘</span>
          <span className="md:hidden">Ctrl</span>
          K
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur sm:pt-28"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePalette()
          }}
        >
          <div className="w-full max-w-2xl">
            <div className="rounded-3xl border border-border bg-surface/90 shadow-[0_0_0_1px_rgba(212,212,212,0.08)] backdrop-blur">
              <div className="flex items-center gap-3 px-5 py-4">
                <Search className="h-5 w-5 text-foreground-muted" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tickers, news, tags…"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted focus:outline-none"
                  aria-label="Search query"
                />
                <span className="rounded-full border border-border-subtle bg-background/60 px-2 py-0.5 font-mono text-[10px] text-foreground-muted">
                  ESC
                </span>
              </div>

              <div className="border-t border-border-subtle px-5 py-4">
                {isLoading ? (
                  <p className="text-xs text-foreground-muted">Searching…</p>
                ) : null}

                {!isLoading && trimmedQuery.length < 2 ? (
                  <div className="grid gap-3">
                    <p className="text-xs text-foreground-muted">Quick links</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {quickLinks.map((link) => (
                        <button
                          key={link.href}
                          type="button"
                          onClick={() => onNavigate({ href: link.href })}
                          className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-background/40 px-4 py-3 text-left text-sm text-foreground transition hover:border-accent/30"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="h-4 w-4 text-foreground-muted group-hover:text-accent" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-foreground-muted">
                      Type at least 2 characters to search tickers and published articles.
                    </p>
                  </div>
                ) : null}

                {!isLoading && response ? (
                  <div className="grid gap-5">
                    <section className="grid gap-2">
                      <p className="text-xs text-foreground-muted">Tickers</p>
                      {response.tickers.length ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {response.tickers.map((ticker) => (
                            <button
                              key={ticker.symbol}
                              type="button"
                              onClick={() => onNavigate({ href: `/news?ticker=${encodeURIComponent(ticker.symbol)}` })}
                              className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-background/40 px-4 py-3 text-left text-sm text-foreground transition hover:border-accent/30"
                            >
                              <span className="font-mono">{ticker.symbol}</span>
                              <ArrowUpRight className="h-4 w-4 text-foreground-muted group-hover:text-accent" aria-hidden="true" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-foreground-muted">No tickers found.</p>
                      )}
                    </section>

                    <section className="grid gap-2">
                      <p className="text-xs text-foreground-muted">Articles</p>
                      {response.articles.length ? (
                        <div className="grid gap-2">
                          {response.articles.map((article) => (
                            <button
                              key={article.slug}
                              type="button"
                              onClick={() => onNavigate({ href: `/news/${article.slug}` })}
                              className="group flex flex-col gap-1 rounded-2xl border border-border-subtle bg-background/40 px-4 py-3 text-left transition hover:border-accent/30"
                            >
                              <span className="text-sm text-foreground">{article.title}</span>
                              <span className="flex flex-wrap items-center gap-2 text-[11px] text-foreground-muted">
                                <span className="font-mono">{formatTimestamp({ iso: article.publishedAt })}</span>
                                {article.tickers?.length ? (
                                  <span className="font-mono">{article.tickers.slice(0, 3).join(", ")}</span>
                                ) : null}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-foreground-muted">No articles found.</p>
                      )}
                    </section>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

async function fetchSearch({ query }: { query: string }) {
  const url = `/api/search?q=${encodeURIComponent(query)}`
  const response = await fetch(url)

  if (!response.ok) throw new Error("Failed to fetch search results")

  return (await response.json()) as SearchResponse
}

function formatTimestamp({ iso }: { iso: string }) {
  if (!iso) return ""

  return iso.replace("T", " ").replace("Z", " UTC").slice(0, 19)
}

interface SearchResponse {
  tickers: Array<{ symbol: string }>
  articles: Array<{ slug: string; title: string; publishedAt: string; tickers: string[] }>
}
