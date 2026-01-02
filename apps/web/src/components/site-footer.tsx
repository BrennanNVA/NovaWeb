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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 text-sm text-foreground-muted sm:px-6 lg:px-8">
        {/* Advertisement Section - Centered */}
        <div className="flex flex-col items-center">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-foreground-muted/50">Sponsored</p>
          <AdsterraNativeBanner className="max-w-[728px]" />
        </div>
        
        {/* Footer Content */}
        <div className="flex flex-col items-center gap-4 pt-4 border-t border-border-subtle">
          {/* Security & Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>TLS Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Secure Data</span>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/legal" className="hover:text-foreground transition-colors">
              Legal
            </Link>
            <Link href="/legal#privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/legal#licensing" className="hover:text-foreground transition-colors">
              Licensing
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-foreground-muted/60">© {new Date().getFullYear()} Nova Aetus. AI-powered financial insights and research.</p>
        </div>
      </div>
    </footer>
  )
}
