const TICKER_TO_DOMAIN: Record<string, string> = {
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  GOOGL: "google.com",
  GOOG: "google.com",
  AMZN: "amazon.com",
  META: "meta.com",
  NVDA: "nvidia.com",
  TSLA: "tesla.com",
  BRK: "berkshirehathaway.com",
  "BRK.B": "berkshirehathaway.com",
  "BRK.A": "berkshirehathaway.com",
  JPM: "jpmorganchase.com",
  V: "visa.com",
  JNJ: "jnj.com",
  WMT: "walmart.com",
  PG: "pg.com",
  MA: "mastercard.com",
  UNH: "unitedhealthgroup.com",
  HD: "homedepot.com",
  DIS: "disney.com",
  BAC: "bankofamerica.com",
  PYPL: "paypal.com",
  NFLX: "netflix.com",
  ADBE: "adobe.com",
  CRM: "salesforce.com",
  INTC: "intel.com",
  CSCO: "cisco.com",
  PFE: "pfizer.com",
  VZ: "verizon.com",
  KO: "coca-cola.com",
  PEP: "pepsico.com",
  ABT: "abbott.com",
  ABBV: "abbvie.com",
  TMO: "thermofisher.com",
  MRK: "merck.com",
  COST: "costco.com",
  AVGO: "broadcom.com",
  NKE: "nike.com",
  MCD: "mcdonalds.com",
  AMD: "amd.com",
  ORCL: "oracle.com",
  IBM: "ibm.com",
  GE: "ge.com",
  CAT: "caterpillar.com",
  GS: "goldmansachs.com",
  MS: "morganstanley.com",
  AXP: "americanexpress.com",
  CVX: "chevron.com",
  XOM: "exxonmobil.com",
  LLY: "lilly.com",
  WFC: "wellsfargo.com",
  C: "citigroup.com",
  RTX: "rtx.com",
  TMUS: "t-mobile.com",
  PLTR: "palantir.com",
  MU: "micron.com",
  LRCX: "lamresearch.com",
  PM: "pmi.com",
  APP: "applovin.com",
}

const CATEGORY_IMAGES: Record<string, string> = {
  macro: "https://images.unsplash.com/photo-1611974717482-480ce5160242?q=80&w=1200&auto=format&fit=crop",
  earnings: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop",
  crypto: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop",
  fed: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop",
  markets: "https://images.unsplash.com/photo-1611974717482-480ce5160242?q=80&w=1200&auto=format&fit=crop",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  energy: "https://images.unsplash.com/photo-1466611653911-954ff2131178?q=80&w=1200&auto=format&fit=crop",
  healthcare: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop",
  finance: "https://images.unsplash.com/photo-1454165833767-027508496b41?q=80&w=1200&auto=format&fit=crop",
  "breaking-news": "https://images.unsplash.com/photo-1585829365234-781f7551f1b0?q=80&w=1200&auto=format&fit=crop",
  world: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop",
  geopolitics: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1200&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1611974717482-480ce5160242?q=80&w=1200&auto=format&fit=crop",
}

export function getStockLogoUrl({ ticker }: { ticker: string }): string | null {
  const domain = TICKER_TO_DOMAIN[ticker.toUpperCase()]
  if (!domain) return null
  return `https://unavatar.io/${domain}?fallback=false`
}

export function getCategoryImageUrl({ tags }: { tags: string[] }): string {
  for (const tag of tags) {
    const normalizedTag = tag.toLowerCase()
    if (CATEGORY_IMAGES[normalizedTag]) {
      return CATEGORY_IMAGES[normalizedTag]
    }
  }
  return CATEGORY_IMAGES.default
}

export function getArticleImageUrl({
  tickers,
  tags,
}: {
  tickers: string[]
  tags: string[]
}): { url: string; type: "logo" | "category"; ticker?: string } {
  // For social media previews (Open Graph), we prefer high-quality category images
  // as they look much better in "summary_large_image" cards than small logos.
  const categoryUrl = getCategoryImageUrl({ tags })
  
  // If we have a ticker and it's specifically requested, we could use the logo,
  // but for the default article image, the category background is usually better.
  if (tickers.length > 0) {
    const primaryTicker = tickers[0]
    // We still return the logo info if needed elsewhere, but the URL will be the category one for metadata
    return { url: categoryUrl, type: "category", ticker: primaryTicker }
  }

  return { url: categoryUrl, type: "category" }
}

export function getMultipleStockLogos({
  tickers,
  limit = 3,
}: {
  tickers: string[]
  limit?: number
}): Array<{ ticker: string; url: string }> {
  const logos: Array<{ ticker: string; url: string }> = []

  for (const ticker of tickers.slice(0, limit)) {
    const url = getStockLogoUrl({ ticker })
    if (url) {
      logos.push({ ticker, url })
    }
  }

  return logos
}
