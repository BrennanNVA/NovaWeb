export const CONSENT_STORAGE_KEY = "novaaetus-consent"
export const CONSENT_EVENT_NAME = "novaaetus-consent"
export const CONSENT_UNKNOWN = "unknown" as const

export interface StoredConsent {
  allowsAds: boolean
  decidedAt: string
}

export type ConsentRawSnapshot = string | null | typeof CONSENT_UNKNOWN

export function getConsentRawSnapshot(): ConsentRawSnapshot {
  if (typeof window === "undefined") return CONSENT_UNKNOWN

  return window.localStorage.getItem(CONSENT_STORAGE_KEY)
}

export function getServerConsentRawSnapshot(): ConsentRawSnapshot {
  return CONSENT_UNKNOWN
}

export function subscribeToConsentChanges(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {}

  window.addEventListener(CONSENT_EVENT_NAME, onStoreChange)
  window.addEventListener("storage", onStoreChange)

  return () => {
    window.removeEventListener(CONSENT_EVENT_NAME, onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

export function parseStoredConsent({ raw }: { raw: ConsentRawSnapshot }) {
  if (raw === CONSENT_UNKNOWN) return CONSENT_UNKNOWN
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!isStoredConsent(parsed)) return null

    return parsed
  } catch {
    return null
  }
}

export function setStoredConsent({ allowsAds }: { allowsAds: boolean }) {
  if (typeof window === "undefined") return

  const payload: StoredConsent = {
    allowsAds,
    decidedAt: new Date().toISOString(),
  }

  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload))
  window.dispatchEvent(new Event(CONSENT_EVENT_NAME))
}

function isStoredConsent(value: unknown): value is StoredConsent {
  if (!value || typeof value !== "object") return false

  const record = value as Record<string, unknown>

  return typeof record.allowsAds === "boolean" && typeof record.decidedAt === "string"
}
