"use client"

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"

import {
  CONSENT_UNKNOWN,
  getConsentRawSnapshot,
  getServerConsentRawSnapshot,
  parseStoredConsent,
  subscribeToConsentChanges,
} from "@/lib/consent"

export interface AdScriptsProps {
  scriptSrc?: string
}

export function AdScripts({ scriptSrc }: AdScriptsProps) {
  const pathname = usePathname()

  const resolvedScriptSrc = useMemo(() => {
    if (scriptSrc) return scriptSrc
    return process.env.NEXT_PUBLIC_AD_SCRIPT_SRC
  }, [scriptSrc])

  const hasInjectedRef = useRef(false)

  const consentRaw = useSyncExternalStore(
    subscribeToConsentChanges,
    getConsentRawSnapshot,
    getServerConsentRawSnapshot,
  )

  const allowsAds = useMemo(() => {
    if (pathname.startsWith("/embed/")) return false

    const consent = parseStoredConsent({ raw: consentRaw })

    if (!consent) return false
    if (consent === CONSENT_UNKNOWN) return false

    return consent.allowsAds
  }, [consentRaw, pathname])

  useEffect(() => {
    if (!allowsAds) return
    if (!resolvedScriptSrc) return
    if (hasInjectedRef.current) return

    const existing = document.querySelector(`script[src="${resolvedScriptSrc}"]`)
    if (existing) {
      hasInjectedRef.current = true
      return
    }

    const script = document.createElement("script")
    script.src = resolvedScriptSrc
    script.async = true

    document.head.appendChild(script)
    hasInjectedRef.current = true
  }, [allowsAds, resolvedScriptSrc])

  return null
}
