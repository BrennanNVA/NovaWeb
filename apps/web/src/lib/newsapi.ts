import "server-only"

const NEWSAPI_BASE_URL = "https://newsapi.org/v2"

interface NewsAPIArticle {
  source: { id: string | null; name: string }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

export interface WorldNewsArticle {
  title: string
  description: string | null
  source: string
  url: string
  imageUrl: string | null
  publishedAt: string
  content: string | null
}

function getNewsAPIKey(): string {
  const apiKey = process.env.NEWSAPI_KEY
  if (!apiKey) {
    throw new Error("NEWSAPI_KEY must be set")
  }
  return apiKey
}

export async function fetchTopHeadlines({
  category = "business",
  country = "us",
  pageSize = 10,
}: {
  category?: "business" | "technology" | "general" | "science" | "health"
  country?: string
  pageSize?: number
} = {}): Promise<WorldNewsArticle[]> {
  const apiKey = getNewsAPIKey()
  
  const params = new URLSearchParams({
    apiKey,
    category,
    country,
    pageSize: pageSize.toString(),
  })

  const response = await fetch(`${NEWSAPI_BASE_URL}/top-headlines?${params}`, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("NewsAPI error:", error)
    return []
  }

  const data: NewsAPIResponse = await response.json()

  return data.articles.map((article) => ({
    title: article.title,
    description: article.description,
    source: article.source.name,
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    content: article.content,
  }))
}

export async function fetchBreakingNews({
  query,
  pageSize = 5,
}: {
  query?: string
  pageSize?: number
} = {}): Promise<WorldNewsArticle[]> {
  const apiKey = getNewsAPIKey()
  
  const params = new URLSearchParams({
    apiKey,
    pageSize: pageSize.toString(),
    language: "en",
    sortBy: "publishedAt",
  })

  if (query) {
    params.set("q", query)
  } else {
    params.set("q", "breaking OR urgent OR developing")
  }

  const response = await fetch(`${NEWSAPI_BASE_URL}/everything?${params}`, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("NewsAPI error:", error)
    return []
  }

  const data: NewsAPIResponse = await response.json()

  return data.articles.map((article) => ({
    title: article.title,
    description: article.description,
    source: article.source.name,
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    content: article.content,
  }))
}

export async function fetchNewsForTopic({
  topic,
  pageSize = 5,
}: {
  topic: string
  pageSize?: number
}): Promise<WorldNewsArticle[]> {
  const apiKey = getNewsAPIKey()
  
  const params = new URLSearchParams({
    apiKey,
    q: topic,
    pageSize: pageSize.toString(),
    language: "en",
    sortBy: "relevancy",
  })

  const response = await fetch(`${NEWSAPI_BASE_URL}/everything?${params}`, {
    next: { revalidate: 600 },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("NewsAPI error:", error)
    return []
  }

  const data: NewsAPIResponse = await response.json()

  return data.articles.map((article) => ({
    title: article.title,
    description: article.description,
    source: article.source.name,
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    content: article.content,
  }))
}

export async function fetchMarketMovingNews(): Promise<WorldNewsArticle[]> {
  const queries = [
    "stock market",
    "federal reserve",
    "inflation",
    "earnings report",
    "IPO",
    "merger acquisition",
  ]
  
  const randomQuery = queries[Math.floor(Math.random() * queries.length)]
  
  return fetchNewsForTopic({ topic: randomQuery, pageSize: 5 })
}

export async function fetchWorldBreakingNews(): Promise<WorldNewsArticle[]> {
  const apiKey = getNewsAPIKey()
  
  const params = new URLSearchParams({
    apiKey,
    category: "general",
    country: "us",
    pageSize: "20",
  })

  const response = await fetch(`${NEWSAPI_BASE_URL}/top-headlines?${params}`, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("NewsAPI error:", error)
    return []
  }

  const data: NewsAPIResponse = await response.json()

  const breakingKeywords = [
    "breaking",
    "urgent",
    "developing",
    "just in",
    "alert",
    "exclusive",
    "update",
  ]

  const breakingArticles = data.articles.filter((article) => {
    const titleLower = article.title.toLowerCase()
    const descLower = (article.description || "").toLowerCase()
    return breakingKeywords.some(
      (keyword) => titleLower.includes(keyword) || descLower.includes(keyword)
    )
  })

  const articlesToReturn = breakingArticles.length > 0 ? breakingArticles : data.articles.slice(0, 5)

  return articlesToReturn.map((article) => ({
    title: article.title,
    description: article.description,
    source: article.source.name,
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    content: article.content,
  }))
}
