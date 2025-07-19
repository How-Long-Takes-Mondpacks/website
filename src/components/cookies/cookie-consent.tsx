"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CookieCategory, DEFAULT_COOKIE_EXPIRATION_DAYS, hasMadeCookieChoice } from "@/lib/cookies"
import { useCookiePreferences } from "@/hooks/use-cookie-preferences"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/components/providers/lang-provider"

interface CookieConsentProps {
  forceOpen?: boolean
  onClose?: () => void
}

export function CookieConsent({ forceOpen = false, onClose }: CookieConsentProps) {
  const { t, isRtl } = useI18n()
  const [open, setOpen] = useState(forceOpen)
  const [showDetails, setShowDetails] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const { preferences, isLoaded, acceptAll, acceptEssentialOnly, savePreferences } =
    useCookiePreferences()

  // Local state for cookie expiration
  const [expirationDays, setExpirationDays] = useState(DEFAULT_COOKIE_EXPIRATION_DAYS)
  // Local state for switch selections
  const [localPreferences, setLocalPreferences] = useState<Record<CookieCategory, boolean>>({
    [CookieCategory.ESSENTIAL]: true,
    [CookieCategory.FUNCTIONAL]: false,
    [CookieCategory.ANALYTICS]: false,
    [CookieCategory.MARKETING]: false,
  })

  // Update local preferences when the actual preferences load
  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        [CookieCategory.ESSENTIAL]: true,
        [CookieCategory.FUNCTIONAL]: preferences.categories[CookieCategory.FUNCTIONAL],
        [CookieCategory.ANALYTICS]: preferences.categories[CookieCategory.ANALYTICS],
        [CookieCategory.MARKETING]: preferences.categories[CookieCategory.MARKETING],
      })
      setExpirationDays(preferences.expirationDays)
    }
  }, [preferences])

  // Check if we're on the client side and if the user has made a choice
  useEffect(() => {
    setIsClient(true)

    if (isLoaded && !forceOpen && !hasMadeCookieChoice()) {
      setOpen(true)
    }
  }, [isLoaded, forceOpen])

  // Handle dialog close
  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen && onClose) {
      onClose()
    }
  }

  // Handle accept all action
  const handleAcceptAll = () => {
    acceptAll(expirationDays)
    setOpen(false)
    if (onClose) onClose()
  }

  // Handle essential only action
  const handleEssentialOnly = () => {
    acceptEssentialOnly(expirationDays)
    setOpen(false)
    if (onClose) onClose()
  }

  // Handle save preferences action
  const handleSavePreferences = () => {
    if (preferences) {
      const newPreferences = { ...preferences }
      newPreferences.accepted = true
      newPreferences.categories[CookieCategory.FUNCTIONAL] = localPreferences[CookieCategory.FUNCTIONAL]
      newPreferences.categories[CookieCategory.ANALYTICS] = localPreferences[CookieCategory.ANALYTICS]
      newPreferences.categories[CookieCategory.MARKETING] = localPreferences[CookieCategory.MARKETING]

      savePreferences(newPreferences, expirationDays)
      setOpen(false)
      if (onClose) onClose()
    }
  }

  // Toggle a category in local state
  const toggleCategory = (category: CookieCategory) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  if (!isClient || !isLoaded) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={handleDialogClose}>
      <AlertDialogContent className={`max-w-md ${isRtl ? "text-right" : "text-left"}`}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("cookies.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("cookies.description")}{" "}
            <Link href="/cookie-policy" className="text-blue-600 hover:underline" target="_blank">
              {t("cookies.policy_link")}
            </Link>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {showDetails ? (
          <div className="py-4">
            {/* Essential cookies - always checked and disabled */}
            <Card className="mb-3 gap-2">
              <CardHeader className="px-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t("cookies.categories.essential.title")}
                  </CardTitle>
                  <Switch checked disabled />
                </div>
              </CardHeader>
              <CardContent className="px-3">
                <CardDescription className="text-xs">
                  {t("cookies.categories.essential.description")}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Functional cookies */}
            <Card className="mb-3 gap-2">
              <CardHeader className="px-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t("cookies.categories.functional.title")}
                  </CardTitle>
                  <Switch
                    checked={localPreferences[CookieCategory.FUNCTIONAL]}
                    onCheckedChange={() => toggleCategory(CookieCategory.FUNCTIONAL)}
                  />
                </div>
              </CardHeader>
              <CardContent className="px-3">
                <CardDescription className="text-xs">
                  {t("cookies.categories.functional.description")}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Analytics cookies */}
            <Card className="mb-3 gap-2">
              <CardHeader className="px-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t("cookies.categories.analytics.title")}
                  </CardTitle>
                  <Switch
                    checked={localPreferences[CookieCategory.ANALYTICS]}
                    onCheckedChange={() => toggleCategory(CookieCategory.ANALYTICS)}
                  />
                </div>
              </CardHeader>
              <CardContent className="px-3">
                <CardDescription className="text-xs">
                  {t("cookies.categories.analytics.description")}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Marketing cookies */}
            <Card className="mb-3 gap-2">
              <CardHeader className="px-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t("cookies.categories.marketing.title")}
                  </CardTitle>
                  <Switch
                    checked={localPreferences[CookieCategory.MARKETING]}
                    onCheckedChange={() => toggleCategory(CookieCategory.MARKETING)}
                  />
                </div>
              </CardHeader>
              <CardContent className="px-3">
                <CardDescription className="text-xs">
                  {t("cookies.categories.marketing.description")}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Cookie expiration selection */}
            <Card className="mb-3 gap-2">
              <CardHeader className="px-3">
                <CardTitle className="text-sm font-medium">{t("cookies.expiration.title")}</CardTitle>
              </CardHeader>
              <CardContent className="px-3">
                <CardDescription className="text-xs mb-3">
                  {t("cookies.expiration.description")}
                </CardDescription>
                <Select
                  value={expirationDays.toString()}
                  onValueChange={(e) => setExpirationDays(Number(e))}
                >
                  <SelectTrigger
                    className="w-full p-2 border rounded text-sm"
                  >
                    <SelectValue placeholder="Select an expiration time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">{t("cookies.expiration.thirty_days")}</SelectItem>
                    <SelectItem value="90">{t("cookies.expiration.ninety_days")}</SelectItem>
                    <SelectItem value="180">{t("cookies.expiration.six_months")}</SelectItem>
                    <SelectItem value="365">{t("cookies.expiration.one_year")}</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Back
              </Button>
              <Button onClick={handleSavePreferences}>{t("cookies.save")}</Button>
            </div>
          </div>
        ) : (
          <AlertDialogFooter className={`flex-col space-y-2 sm:space-y-0 ${isRtl ? "items-end" : "items-start"}`}>
            <div className="flex flex-col w-full gap-2">
              <Button onClick={handleAcceptAll} className="w-full">
                {t("cookies.accept_all")}
              </Button>
              <Button variant="outline" onClick={handleEssentialOnly} className="w-full">
                {t("cookies.accept_essential")}
              </Button>
              <Button variant="secondary" onClick={() => setShowDetails(true)} className="w-full">
                {t("cookies.manage")}
              </Button>
            </div>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
