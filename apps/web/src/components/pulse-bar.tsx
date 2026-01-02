"use client"

import { useEffect, useState } from "react"

interface PulseItem {
  symbol: string
  price: string
  change: string
  changePercent: string
  isUp: boolean
}

const DEFAULT_PULSE_ITEMS: PulseItem[] = [
  { symbol: "SPX", price: "4,842.11", change: "+12.44", changePercent: "+0.26%", isUp: true },
  { symbol: "NDX", price: "16,901.52", change: "-38.21", changePercent: "-0.23%", isUp: false },
  { symbol: "NVDA", price: "498.22", change: "+4.11", changePercent: "+0.83%", isUp: true },
  { symbol: "AAPL", price: "192.07", change: "-0.42", changePercent: "-0.22%", isUp: false },
  { symbol: "MSFT", price: "411.18", change: "+1.09", changePercent: "+0.27%", isUp: true },
  { symbol: "BTC", price: "45,220", change: "+310", changePercent: "+0.69%", isUp: true },
  { symbol: "ETH", price: "2,390", change: "-14", changePercent: "-0.58%", isUp: false },
  { symbol: "DXY", price: "102.44", change: "+0.12", changePercent: "+0.12%", isUp: true },
  { symbol: "UST10Y", price: "4.12%", change: "-2bp", changePercent: "-0.02%", isUp: false },
]

export function PulseBar() {
  const [items, setItems] = useState<PulseItem[]>(DEFAULT_PULSE_ITEMS)

  useEffect(() => {
    async function fetchPulse() {
      try {
        const response = await fetch("/api/pulse")
        if (response.ok) {
          const data = await response.json()
          if (data.items?.length) {
            setItems(data.items)
          }
        }
      } catch {
        // Keep default items on error
      }
    }

    fetchPulse()
    const interval = setInterval(fetchPulse, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border-b border-border-subtle bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
        <span className="hidden shrink-0 font-mono text-foreground-muted sm:inline">PULSE</span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-[pulse-marquee_42s_linear_infinite] gap-6 pr-6">
            {items.concat(items).map((item, index) => (
              <div
                key={`${item.symbol}-${index}`}
                className="flex items-baseline gap-2 whitespace-nowrap font-mono"
              >
                <span className="text-foreground">{item.symbol}</span>
                <span className="text-foreground-muted">{item.price}</span>
                <span className={item.isUp ? "text-positive" : "text-negative"}>
                  {item.change} ({item.changePercent})
                </span>
              </div>
            ))}
          </div>
        </div>
        <span className="hidden shrink-0 font-mono text-foreground-muted md:inline">Delayed</span>
      </div>
    </div>
  )
}
