import { NextResponse } from "next/server"

// Interface for language information from external API
interface ExternalLanguageInfo {
  code: string
  name: string
  nativeName: string
}

// Cache for language data to avoid repeated API calls
let languageCache: Record<string, any> | null = null

export async function GET() {
  try {
    // If we have cached data, return it
    if (languageCache) {
      return NextResponse.json(languageCache)
    }

    // Fetch language data from REST Countries API
    const response = await fetch("https://restcountries.com/v3.1/all?fields=languages,name,cca2")

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Process the data to extract language information
    const languageMap: Record<string, ExternalLanguageInfo> = {}

    data.forEach((country: any) => {
      if (country.languages) {
        Object.entries(country.languages).forEach(([code, name]: [string, any]) => {
          // Only add if we don't already have this language or if this is the primary country for the language
          if (!languageMap[code] || country.name.common === getLanguagePrimaryCountry(code)) {
            languageMap[code] = {
              code,
              name: String(name),
              nativeName: String(name), // The API doesn't always provide native names, so we use the name as fallback
            }
          }
        })
      }
    })

    // Map our language codes to the API data
    const languageData: Record<string, any> = {
      en_us: {
        countryCode: "us",
        nativeName: "English (US)",
        englishName: "English (US)",
      },
      es_es: {
        countryCode: "es",
        nativeName: languageMap.spa ? `${languageMap.spa.nativeName} (España)` : "Español (España)",
        englishName: "Spanish (Spain)",
      },
      ar_sa: {
        countryCode: "sa",
        nativeName: languageMap.ara ? `${languageMap.ara.nativeName} (السعودية)` : "العربية (السعودية)",
        englishName: "Arabic (Saudi Arabia)",
      },
      fr_fr: {
        countryCode: "fr",
        nativeName: languageMap.fra ? `${languageMap.fra.nativeName} (France)` : "Français (France)",
        englishName: "French (France)",
      },
      de_de: {
        countryCode: "de",
        nativeName: languageMap.deu ? `${languageMap.deu.nativeName} (Deutschland)` : "Deutsch (Deutschland)",
        englishName: "German (Germany)",
      },
      ja_jp: {
        countryCode: "jp",
        nativeName: languageMap.jpn ? `${languageMap.jpn.nativeName} (日本)` : "日本語 (日本)",
        englishName: "Japanese (Japan)",
      },
      zh_cn: {
        countryCode: "cn",
        nativeName: languageMap.zho ? `${languageMap.zho.nativeName} (中国)` : "中文 (中国)",
        englishName: "Chinese (China)",
      },
      ru_ru: {
        countryCode: "ru",
        nativeName: languageMap.rus ? `${languageMap.rus.nativeName} (Россия)` : "Русский (Россия)",
        englishName: "Russian (Russia)",
      },
      pt_br: {
        countryCode: "br",
        nativeName: languageMap.por ? `${languageMap.por.nativeName} (Brasil)` : "Português (Brasil)",
        englishName: "Portuguese (Brazil)",
      },
      it_it: {
        countryCode: "it",
        nativeName: languageMap.ita ? `${languageMap.ita.nativeName} (Italia)` : "Italiano (Italia)",
        englishName: "Italian (Italy)",
      },
      he_il: {
        countryCode: "il",
        nativeName: languageMap.heb ? `${languageMap.heb.nativeName} (ישראל)` : "עברית (ישראל)",
        englishName: "Hebrew (Israel)",
      },
      hi_in: {
        countryCode: "in",
        nativeName: languageMap.hin ? `${languageMap.hin.nativeName} (भारत)` : "हिन्दी (भारत)",
        englishName: "Hindi (India)",
      },
      ko_kr: {
        countryCode: "kr",
        nativeName: languageMap.kor ? `${languageMap.kor.nativeName} (대한민국)` : "한국어 (대한민국)",
        englishName: "Korean (South Korea)",
      },
    }

    // Cache the data
    languageCache = languageData

    return NextResponse.json(languageData)
  } catch (error) {
    console.error("Error fetching language data:", error)

    // Return fallback data in case of error
    return NextResponse.json(
      {
        en_us: { countryCode: "us", nativeName: "English (US)", englishName: "English (US)" },
        es_es: { countryCode: "es", nativeName: "Español (España)", englishName: "Spanish (Spain)" },
        ar_sa: { countryCode: "sa", nativeName: "العربية (السعودية)", englishName: "Arabic (Saudi Arabia)" },
        fr_fr: { countryCode: "fr", nativeName: "Français (France)", englishName: "French (France)" },
        de_de: { countryCode: "de", nativeName: "Deutsch (Deutschland)", englishName: "German (Germany)" },
        ja_jp: { countryCode: "jp", nativeName: "日本語 (日本)", englishName: "Japanese (Japan)" },
        zh_cn: { countryCode: "cn", nativeName: "中文 (中国)", englishName: "Chinese (China)" },
        ru_ru: { countryCode: "ru", nativeName: "Русский (Россия)", englishName: "Russian (Russia)" },
        pt_br: { countryCode: "br", nativeName: "Português (Brasil)", englishName: "Portuguese (Brazil)" },
        it_it: { countryCode: "it", nativeName: "Italiano (Italia)", englishName: "Italian (Italy)" },
        he_il: { countryCode: "il", nativeName: "עברית (ישראל)", englishName: "Hebrew (Israel)" },
        hi_in: { countryCode: "in", nativeName: "हिन्दी (भारत)", englishName: "Hindi (India)" },
        ko_kr: { countryCode: "kr", nativeName: "한국어 (대한민국)", englishName: "Korean (South Korea)" },
      },
      { status: 500 },
    )
  }
}

// Helper function to determine the primary country for a language
function getLanguagePrimaryCountry(code: string): string {
  const primaryCountries: Record<string, string> = {
    eng: "United Kingdom",
    spa: "Spain",
    ara: "Saudi Arabia",
    fra: "France",
    deu: "Germany",
    jpn: "Japan",
    zho: "China",
    rus: "Russia",
    por: "Portugal", // Note: Brazil is the largest Portuguese-speaking country, but Portugal is the origin
    ita: "Italy",
    heb: "Israel",
    hin: "India",
    kor: "South Korea",
  }

  return primaryCountries[code] || ""
}
