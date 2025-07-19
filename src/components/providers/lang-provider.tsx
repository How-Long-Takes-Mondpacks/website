'use client'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { initI18n, type LanguageMessages } from '@/lib/i18n'
import { isRtlLanguage } from '@/lib/lang'
import { LocaleName } from '@/types/translations'

type ContextProps = ReturnType<typeof initI18n> & {
  setLocale: (locale: LocaleName) => void
  locale: LocaleName
  userLocale: LocaleName
  isRtl: boolean
}

const TranslationContext = createContext<ContextProps | null>(null)

const COOKIE_NAME = "active_lang"

function setLangCookie(lang: LocaleName) {
  if (typeof window === 'undefined') return

  document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https' ? 'Secure;' : ''}`
}

export function LanguageProvider({
  defaultLocale,
  translations,
  fallbackLocale,
  children
}: {
  defaultLocale?: LocaleName
  translations: Record<Lowercase<LocaleName>, LanguageMessages>
  fallbackLocale: LocaleName | LocaleName[]
  children: ReactNode
}) {
  const [locale, setCurrentLocale] = useState<LocaleName>(() => {
    if (defaultLocale == null) return navigator.language.replace("-", "_").toLowerCase() as LocaleName
    return defaultLocale
  })
  const isRtl = isRtlLanguage(locale)

  // Update document direction based on language
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRtl ? "rtl" : "ltr"
      document.documentElement.lang = locale
    }
  }, [locale, isRtl])
  
  const initRes = useMemo(() => {
    return initI18n({
      locale,
      fallbackLocale,
      translations
    })
  }, [locale, fallbackLocale, translations])

  const value = useMemo(() => {
    return {
      ...initRes,
      setLocale: (locale: LocaleName) => {
        setCurrentLocale(locale)
        setLangCookie(locale)
      },
      locale,
      userLocale: navigator.language.replace("-", "_").toLowerCase() as LocaleName,
      isRtl
    }
  }, [locale, isRtl, initRes])

  return (
    <TranslationContext.Provider
      value={value}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(TranslationContext)
  if (context == null) throw new Error("useI18n must be used within a LanguageProvider")
  return context
}