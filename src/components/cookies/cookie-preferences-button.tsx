"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/providers/lang-provider"
import { CookieConsent } from "@/components/cookies/cookie-consent"

export function CookiePreferencesButton() {
  const { t } = useI18n()
  const [showPreferences, setShowPreferences] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowPreferences(true)}>
        {t("cookies.manage")}
      </Button>
      {showPreferences && <CookieConsent forceOpen={true} onClose={() => setShowPreferences(false)} />}
    </>
  )
}
