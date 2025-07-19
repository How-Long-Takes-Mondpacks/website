"use client"

import { useState, useEffect } from "react"
import {
  CookieCategory,
  type CookiePreferences,
  getCookiePreferences,
  saveCookiePreferences,
  updateCookieCategory,
  acceptAllCookies,
  acceptEssentialCookiesOnly,
  getExpirationTimestamp,
  DEFAULT_COOKIE_EXPIRATION_DAYS,
  havePreferencesExpired,
} from "@/lib/cookies"

export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasExpired, setHasExpired] = useState(false)

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = () => {
      const prefs = getCookiePreferences()
      setPreferences(prefs)
      setHasExpired(havePreferencesExpired())
      setIsLoaded(true)
    }

    loadPreferences()

    // Listen for storage events (in case preferences are updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cookie_preferences") {
        loadPreferences()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Update a specific category
  const updateCategory = (category: CookieCategory, accepted: boolean) => {
    updateCookieCategory(category, accepted)
    setPreferences(getCookiePreferences())
  }

  // Accept all cookies
  const acceptAll = (expirationDays: number) => {
    acceptAllCookies(expirationDays)
    setPreferences(getCookiePreferences())
    setHasExpired(false)
  }

  // Accept only essential cookies
  const acceptEssentialOnly = (expirationDays: number) => {
    acceptEssentialCookiesOnly(expirationDays)
    setPreferences(getCookiePreferences())
    setHasExpired(false)
  }

  // Save custom preferences
  const savePreferences = (
    newPreferences: Partial<CookiePreferences>,
    expirationDays = DEFAULT_COOKIE_EXPIRATION_DAYS,
  ) => {
    const currentPrefs = getCookiePreferences()
    const updatedPrefs: CookiePreferences = {
      ...currentPrefs,
      ...newPreferences,
      timestamp: Date.now(),
      expiresAt: getExpirationTimestamp(expirationDays),
      expirationDays
    }

    saveCookiePreferences(updatedPrefs)
    setPreferences(updatedPrefs)
    setHasExpired(false)
  }

  return {
    preferences,
    isLoaded,
    hasExpired,
    updateCategory,
    acceptAll,
    acceptEssentialOnly,
    savePreferences,
    isCategoryAccepted: (category: CookieCategory) =>
      preferences?.categories[category] || category === CookieCategory.ESSENTIAL,
  }
}
