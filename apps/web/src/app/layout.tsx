import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"

import { ConsentBanner } from "@/components/consent-banner"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Nova Aetus - AI-Powered Financial News & Market Intelligence",
    template: "%s | Nova Aetus",
  },
  description: "Get real-time AI-powered financial news, stock analysis, market insights, and quantitative research. Track breaking market events and make informed investment decisions.",
  metadataBase: new URL("https://www.novaaetus.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nova Aetus",
    title: "Nova Aetus - AI-Powered Financial News & Market Intelligence",
    description: "Get real-time AI-powered financial news, stock analysis, market insights, and quantitative research. Track breaking market events and make informed investment decisions.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@NovaAetus",
    creator: "@NovaAetus",
    title: "Nova Aetus - AI-Powered Financial News & Market Intelligence",
    description: "Get real-time AI-powered financial news, stock analysis, market insights, and quantitative research. Track breaking market events and make informed investment decisions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nova Aetus",
    url: "https://www.novaaetus.com",
    logo: "https://www.novaaetus.com/logo.png",
    description: "AI-powered financial news, market insights, and quantitative research hub.",
    sameAs: [
      "https://x.com/NovaAetus",
      "https://www.facebook.com/profile.php?id=61585911006724",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://www.novaaetus.com/about",
    },
  }

  return (
    <html lang="en" className="h-full dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-zinc-950 focus:shadow-lg dark:focus:bg-zinc-950 dark:focus:text-zinc-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
        <ConsentBanner />
      </body>
    </html>
  )
}
