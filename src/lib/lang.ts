import { LocaleName } from "../types/translations"

// Interface for language information
export interface LanguageInfo {
  code: LocaleName
  countryCode: string
  nativeName: string
  englishName: string
  direction: "ltr" | "rtl"
}

// Cache for API data
let apiDataCache: Record<string, any> | null = null

// List of RTL languages
export const RTL_LANGUAGES: LocaleName[] = []

// Check if a language is RTL
export const isRtlLanguage = (code: LocaleName): boolean => {
  return RTL_LANGUAGES.includes(code)
}

// Fetch language data from API
export const fetchLanguageData = async (): Promise<Record<string, any>> => {
  if (apiDataCache) {
    return apiDataCache
  }

  try {
    const response = await fetch("/api/languages")

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    apiDataCache = data
    return data
  } catch (error) {
    console.error("Error fetching language data:", error)
    // Return fallback data
    return getFallbackLanguageData()
  }
}

// Get language info with API data
export const getLanguageInfo = async (code: LocaleName): Promise<LanguageInfo> => {
  const apiData = await fetchLanguageData()

  // Default values
  const info: LanguageInfo = {
    code,
    countryCode: "",
    nativeName: code,
    englishName: code,
    direction: "ltr",
  }

  // Get data from API if available
  if (apiData && apiData[code]) {
    info.countryCode = apiData[code].countryCode || code.split("_")[1]?.toLowerCase() || ""
    info.nativeName = apiData[code].nativeName || code
    info.englishName = apiData[code].englishName || code
  } else {
    // Fallback to extracting from code
    const [language, country] = code.split("_")
    info.countryCode = country?.toLowerCase() || ""
  }

  // Set direction
  info.direction = isRtlLanguage(code) ? "rtl" : "ltr"

  return info
}

// Synchronous version for initial render
export const getLanguageInfoSync = (code: LocaleName): LanguageInfo => {
  // Default values
  const info: LanguageInfo = {
    code,
    countryCode: "",
    nativeName: code,
    englishName: code,
    direction: "ltr",
  }

  // Get data from cache if available
  if (apiDataCache && apiDataCache[code]) {
    info.countryCode = apiDataCache[code].countryCode || code.split("_")[1]?.toLowerCase() || ""
    info.nativeName = apiDataCache[code].nativeName || code
    info.englishName = apiDataCache[code].englishName || code
  } else {
    // Fallback to hardcoded values
    const fallbackData = getFallbackLanguageData()
    if (fallbackData[code]) {
      info.countryCode = fallbackData[code].countryCode || code.split("_")[1]?.toLowerCase() || ""
      info.nativeName = fallbackData[code].nativeName || code
      info.englishName = fallbackData[code].englishName || code
    } else {
      // Extract from code
      const [language, country] = code.split("_")
      info.countryCode = country?.toLowerCase() || ""
    }
  }

  // Set direction
  info.direction = isRtlLanguage(code) ? "rtl" : "ltr"

  return info
}

// Fallback data in case API fails
function getFallbackLanguageData(): Record<string, any> {
  return {
    en_us: { countryCode: "us", nativeName: "English (US)", englishName: "English (US)" },
    es_es: { countryCode: "es", nativeName: "Español (España)", englishName: "Spanish (Spain)" },
    /*ar_sa: { countryCode: "sa", nativeName: "العربية (السعودية)", englishName: "Arabic (Saudi Arabia)" },
    fr_fr: { countryCode: "fr", nativeName: "Français (France)", englishName: "French (France)" },
    de_de: { countryCode: "de", nativeName: "Deutsch (Deutschland)", englishName: "German (Germany)" },
    ja_jp: { countryCode: "jp", nativeName: "日本語 (日本)", englishName: "Japanese (Japan)" },
    zh_cn: { countryCode: "cn", nativeName: "中文 (中国)", englishName: "Chinese (China)" },
    ru_ru: { countryCode: "ru", nativeName: "Русский (Россия)", englishName: "Russian (Russia)" },
    pt_br: { countryCode: "br", nativeName: "Português (Brasil)", englishName: "Portuguese (Brazil)" },
    it_it: { countryCode: "it", nativeName: "Italiano (Italia)", englishName: "Italian (Italy)" },
    he_il: { countryCode: "il", nativeName: "עברית (ישראל)", englishName: "Hebrew (Israel)" },
    hi_in: { countryCode: "in", nativeName: "हिन्दी (भारत)", englishName: "Hindi (India)" },
    ko_kr: { countryCode: "kr", nativeName: "한국어 (대한민국)", englishName: "Korean (South Korea)" },*/
  }
}