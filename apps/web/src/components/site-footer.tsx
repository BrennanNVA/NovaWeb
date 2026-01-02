"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { Lock, Shield } from "lucide-react"

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith("/embed/")) return null

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-foreground-muted sm:px-6 lg:px-8">
        {/* Advertisement Section */}
        <div className="border-b border-border-subtle pb-6">
          <p className="mb-3 text-xs text-foreground-muted/70">Advertisement</p>
          <AdsterraNativeBanner />
        </div>
        
        {/* Security & Trust Badges */}
        <div className="flex flex-wrap items-center gap-4 border-b border-border-subtle pb-6">
          <div className="flex items-center gap-2 text-xs text-accent">
            <Lock className="h-4 w-4" aria-hidden="true" />
            <span>TLS Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-accent">
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span>Secure Data</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/legal" className="hover:text-accent transition-colors">
            Legal
          </Link>
          <Link href="/legal#privacy" className="hover:text-accent transition-colors">
            Privacy
          </Link>
          <Link href="/legal#licensing" className="hover:text-accent transition-colors">
            Licensing
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            About
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Nova Aetus. AI-powered financial insights and research.</p>
      </div>
    </footer>
  )
}
