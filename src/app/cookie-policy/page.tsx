"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCookiePreferences } from "@/hooks/use-cookie-preferences"
import { useI18n } from "@/components/providers/lang-provider"
import { CookieCategory } from "@/lib/cookies"

function CookiePolicyContent() {
  const { t, isRtl } = useI18n()
  const { preferences, updateCategory, acceptAll, acceptEssentialOnly } = useCookiePreferences()

  const handleToggleCategory = (category: CookieCategory) => {
    if (preferences) {
      updateCategory(category, !preferences.categories[category])
    }
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isRtl ? "text-right" : "text-left"}`}>
      <h1 className="text-3xl font-bold mb-6">{t("cookies.policy.title")}</h1>

      <div className="prose max-w-none mb-8">
        <p>{t("cookies.policy.introduction")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t("cookies.policy.what_are_cookies")}</h2>
        <p>{t("cookies.policy.what_are_cookies_text")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t("cookies.policy.how_we_use")}</h2>
        <p>{t("cookies.policy.how_we_use_text")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t("cookies.policy.types")}</h2>
      </div>

      {/* Cookie categories with toggle controls */}
      <div className="space-y-4 mb-8">
        {/* Essential cookies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("cookies.categories.essential.title")}</CardTitle>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {t("cookies.policy.always_active")}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">{t("cookies.categories.essential.description")}</CardDescription>
            <div className="text-sm">
              <p className="font-medium mb-1">{t("cookies.policy.purpose")}:</p>
              <p>{t("cookies.policy.essential_purpose")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Functional cookies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("cookies.categories.functional.title")}</CardTitle>
              <Button
                variant={preferences?.categories[CookieCategory.FUNCTIONAL] ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleCategory(CookieCategory.FUNCTIONAL)}
              >
                {preferences?.categories[CookieCategory.FUNCTIONAL]
                  ? t("cookies.policy.active")
                  : t("cookies.policy.inactive")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">{t("cookies.categories.functional.description")}</CardDescription>
            <div className="text-sm">
              <p className="font-medium mb-1">{t("cookies.policy.purpose")}:</p>
              <p>{t("cookies.policy.functional_purpose")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Analytics cookies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("cookies.categories.analytics.title")}</CardTitle>
              <Button
                variant={preferences?.categories[CookieCategory.ANALYTICS] ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleCategory(CookieCategory.ANALYTICS)}
              >
                {preferences?.categories[CookieCategory.ANALYTICS]
                  ? t("cookies.policy.active")
                  : t("cookies.policy.inactive")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">{t("cookies.categories.analytics.description")}</CardDescription>
            <div className="text-sm">
              <p className="font-medium mb-1">{t("cookies.policy.purpose")}:</p>
              <p>{t("cookies.policy.analytics_purpose")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Marketing cookies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("cookies.categories.marketing.title")}</CardTitle>
              <Button
                variant={preferences?.categories[CookieCategory.MARKETING] ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleCategory(CookieCategory.MARKETING)}
              >
                {preferences?.categories[CookieCategory.MARKETING]
                  ? t("cookies.policy.active")
                  : t("cookies.policy.inactive")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">{t("cookies.categories.marketing.description")}</CardDescription>
            <div className="text-sm">
              <p className="font-medium mb-1">{t("cookies.policy.purpose")}:</p>
              <p>{t("cookies.policy.marketing_purpose")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="prose max-w-none mb-8">
        <h2 className="text-2xl font-semibold mt-6 mb-4">{t("cookies.policy.managing")}</h2>
        <p>{t("cookies.policy.managing_text")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t("cookies.policy.third_party")}</h2>
        <p>{t("cookies.policy.third_party_text")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t("cookies.policy.updates")}</h2>
        <p>{t("cookies.policy.updates_text")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button onClick={e => acceptAll(180)}>{t("cookies.accept_all")}</Button>
        <Button variant="outline" onClick={e => acceptEssentialOnly(180)}>
          {t("cookies.accept_essential")}
        </Button>
        <Link href="/" passHref>
          <Button variant="link">{t("cookies.policy.back_to_site")}</Button>
        </Link>
      </div>
    </div>
  )
}

export default function CookiePolicyPage() {
  return (
    <CookiePolicyContent />
  )
}
