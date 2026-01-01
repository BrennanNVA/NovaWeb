"use client"

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  CONSENT_UNKNOWN,
  getConsentRawSnapshot,
  getServerConsentRawSnapshot,
  parseStoredConsent,
  subscribeToConsentChanges,
} from "@/lib/consent"

export interface AdsterraNativeBannerProps {
  className?: string
  containerId?: string
  scriptSrc?: string
  label?: string
}

export function AdsterraNativeBanner({
  className,
  containerId = DEFAULT_CONTAINER_ID,
  scriptSrc = DEFAULT_SCRIPT_SRC,
  label = "Advertisement",
}: AdsterraNativeBannerProps) {
  const pathname = usePathname()
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
    if (allowsAds) return

    const existingScript = document.querySelector(
      `script[data-adsterra-container-id="${containerId}"]`,
    )

    if (existingScript) existingScript.remove()

    const container = document.getElementById(containerId)
    if (!container) return

    container.replaceChildren()
    hasInjectedRef.current = false
  }, [allowsAds, containerId])

  useEffect(() => {
    if (!allowsAds) return
    if (!scriptSrc) return
    if (hasInjectedRef.current) return

    const container = document.getElementById(containerId)
    if (!container) return

    container.replaceChildren()

    const existingScript = document.querySelector(
      `script[data-adsterra-container-id="${containerId}"]`,
    )

    if (existingScript) existingScript.remove()

    const script = document.createElement("script")
    script.async = true
    script.src = scriptSrc
    script.setAttribute("data-cfasync", "false")
    script.dataset.adsterraContainerId = containerId

    container.parentElement?.insertBefore(script, container)
    hasInjectedRef.current = true

    return () => {
      script.remove()
    }
  }, [allowsAds, containerId, scriptSrc])

  if (pathname.startsWith("/embed/")) return null

  return (
    <section
      aria-label={label}
      className={cn(
        "relative w-full max-w-[728px] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
      style={{ aspectRatio: "4 / 1" }}
    >
      <div id={containerId} className="h-full w-full" />
      {!allowsAds ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-xs text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      ) : null}
    </section>
  )
}

const DEFAULT_SCRIPT_SRC =
  "https://pl28368809.effectivegatecpm.com/891129fb10e2cfca5c95c0a0fe9d05bc/invoke.js"

const DEFAULT_CONTAINER_ID = "container-891129fb10e2cfca5c95c0a0fe9d05bc"
