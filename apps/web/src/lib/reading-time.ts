export function calculateReadingTime(text: string): number {
  // Average reading speed: 200-250 words per minute
  // We'll use 225 words per minute as our baseline
  const wordsPerMinute = 225
  
  // Count words (split by whitespace, filter out empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
  
  // Calculate reading time in minutes, rounding up
  const readingTime = Math.ceil(words / wordsPerMinute)
  
  // Minimum 1 minute for any content
  return Math.max(1, readingTime)
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return "1 min read"
  return `${minutes} min read`
}
