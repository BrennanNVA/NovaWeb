"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { Lock, Shield } from "lucide-react"

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith("/embed/")) return null

  return (
    <footer className="border-t border-[#3a3a3a] bg-[#2B2B2B]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-[#ededed]/60 sm:px-6 lg:px-8">
        {/* Advertisement Section */}
        <div className="border-b border-[#3a3a3a] pb-6">
          <p className="mb-3 text-xs text-[#ededed]/40">Advertisement</p>
          <AdsterraNativeBanner />
        </div>
        
        {/* Security & Trust Badges */}
        <div className="flex flex-wrap items-center gap-4 border-b border-[#3a3a3a] pb-6">
          <div className="flex items-center gap-2 text-xs text-[#0A9D8F]">
            <Lock className="h-4 w-4" aria-hidden="true" />
            <span>TLS Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#0A9D8F]">
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span>Secure Data</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/legal" className="hover:text-[#0A9D8F] transition-colors">
            Legal
          </Link>
          <Link href="/legal#privacy" className="hover:text-[#0A9D8F] transition-colors">
            Privacy
          </Link>
          <Link href="/legal#licensing" className="hover:text-[#0A9D8F] transition-colors">
            Licensing
          </Link>
          <Link href="/about" className="hover:text-[#0A9D8F] transition-colors">
            About
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Nova Aetus. AI-powered financial insights and research.</p>
      </div>
    </footer>
  )
}
