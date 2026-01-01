"use client"

import Link from "next/link"
import { useMemo, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"

import {
  CONSENT_UNKNOWN,
  getConsentRawSnapshot,
  getServerConsentRawSnapshot,
  parseStoredConsent,
  setStoredConsent,
  subscribeToConsentChanges,
} from "@/lib/consent"

export function ConsentBanner() {
  const pathname = usePathname()

  const consentRaw = useSyncExternalStore(
    subscribeToConsentChanges,
    getConsentRawSnapshot,
    getServerConsentRawSnapshot,
  )

  const consent = useMemo(() => {
    return parseStoredConsent({ raw: consentRaw })
  }, [consentRaw])

  const description = useMemo(() => {
    return "Nova Aetus is ad-supported. Choose whether to allow advertising scripts and cookies."
  }, [])

  function onDecide({ allowsAds }: { allowsAds: boolean }) {
    setStoredConsent({ allowsAds })
  }

  if (pathname.startsWith("/embed/")) return null
  if (consent === CONSENT_UNKNOWN) return null
  if (consent) return null

  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur dark:border-zinc-900 dark:bg-black/90"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Your privacy</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            See <Link href="/legal#privacy" className="underline">Privacy</Link> for details.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onDecide({ allowsAds: true })}
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-white"
          >
            Allow ads
          </button>
          <button
            type="button"
            onClick={() => onDecide({ allowsAds: false })}
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Decline
          </button>
        </div>
      </div>
    </section>
  )
}
