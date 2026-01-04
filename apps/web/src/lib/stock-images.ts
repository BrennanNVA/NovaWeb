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
  macro: "/images/categories/macro.jpg",
  earnings: "/images/categories/earnings.jpg",
  crypto: "/images/categories/crypto.jpg",
  fed: "/images/categories/fed.jpg",
  markets: "/images/categories/markets.jpg",
  tech: "/images/categories/tech.jpg",
  energy: "/images/categories/energy.jpg",
  healthcare: "/images/categories/healthcare.jpg",
  finance: "/images/categories/finance.jpg",
  default: "/images/categories/default.jpg",
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
  if (tickers.length > 0) {
    const primaryTicker = tickers[0]
    const logoUrl = getStockLogoUrl({ ticker: primaryTicker })
    if (logoUrl) {
      return { url: logoUrl, type: "logo", ticker: primaryTicker }
    }
  }

  return { url: getCategoryImageUrl({ tags }), type: "category" }
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
