'use client'
import { useI18n } from "@/components/providers/lang-provider";
import Link from "next/link";

export function CookieLink() {
  const { t } = useI18n()
  return (
    <Link href="/cookie-policy" className="text-sm text-gray-500 hover:text-gray-700">
      {t("cookies.link")}
    </Link>
  )
}