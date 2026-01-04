import { NextResponse } from "next/server"

export async function GET() {
  const content = `# Nova Aetus
> AI-powered financial news, market insights, and quantitative research hub.

## About
Nova Aetus provides real-time AI-powered financial news, stock analysis, market insights, and quantitative research. We help investors track breaking market events and make informed investment decisions.

## Main Sections
- /news - Latest AI-generated financial news and market updates
- /markets - Real-time market data and indices
- /analysis - In-depth stock and market analysis
- /stocks/[symbol] - Individual stock analysis pages
- /research - Quantitative research datasets
- /reproducibility - Model cards and datasheets for research transparency

## Data & APIs
- /sitemap.xml - Full sitemap of all pages
- /robots.txt - Crawler directives

## Contact
- Website: https://www.novaaetus.com
- X (Twitter): https://x.com/NovaAetus
- Facebook: https://www.facebook.com/profile.php?id=61585911006724
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
