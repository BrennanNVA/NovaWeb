"use client"

import { useState } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search markets, news, tickers...",
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState("")

  return (
    <div 
      className={`relative ${className}`}
      role="search"
      aria-label="Search financial data"
    >
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" 
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (onSearch && query.trim()) {
                onSearch(query.trim())
              }
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-surface py-3 pl-12 pr-4 text-sm text-foreground placeholder-foreground-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          aria-label="Search input"
        />
      </div>
    </div>
  )
}
