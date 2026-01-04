import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import Script from "next/script"

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
    images: [
      {
        url: "https://images.unsplash.com/photo-1611974717482-480ce5160242?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Nova Aetus - Financial Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@NovaAetus",
    creator: "@NovaAetus",
    title: "Nova Aetus - AI-Powered Financial News & Market Intelligence",
    description: "Get real-time AI-powered financial news, stock analysis, market insights, and quantitative research. Track breaking market events and make informed investment decisions.",
    images: ["https://images.unsplash.com/photo-1611974717482-480ce5160242?q=80&w=1200&auto=format&fit=crop"],
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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-9B6H0DERV0"

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
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}', { anonymize_ip: true });`}
            </Script>
          </>
        ) : null}
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
