// Define cookie categories
// TODO: update this preferences
export enum CookieCategory {
  ESSENTIAL = "essential", // Always required
  FUNCTIONAL = "functional",
  ANALYTICS = "analytics",
  MARKETING = "marketing",
}

// Interface for cookie preferences
// TODO: update this preferences
export interface CookiePreferences {
  accepted: boolean
  categories: {
    [CookieCategory.ESSENTIAL]: boolean // Always true
    [CookieCategory.FUNCTIONAL]: boolean
    [CookieCategory.ANALYTICS]: boolean
    [CookieCategory.MARKETING]: boolean
  }
  timestamp: number
  expiresAt: number,
  expirationDays: number
}

// Storage key for cookie preferences
const COOKIE_PREFERENCES_KEY = "cookie_preferences"

// Default cookie expiration in days
export const DEFAULT_COOKIE_EXPIRATION_DAYS = 180 // 6 months

// Calculate expiration timestamp
export function getExpirationTimestamp(days: number = DEFAULT_COOKIE_EXPIRATION_DAYS): number {
  return Date.now() + days * 24 * 60 * 60 * 1000
}

// Default preferences (nothing accepted except essential)
// TODO: update this preferences
const defaultPreferences: CookiePreferences = {
  accepted: false,
  categories: {
    [CookieCategory.ESSENTIAL]: true, // Essential cookies are always required
    [CookieCategory.FUNCTIONAL]: false,
    [CookieCategory.ANALYTICS]: false,
    [CookieCategory.MARKETING]: false,
  },
  timestamp: Date.now(),
  expiresAt: getExpirationTimestamp(),
  expirationDays: DEFAULT_COOKIE_EXPIRATION_DAYS
}

// Save preferences to localStorage
export function saveCookiePreferences(preferences: CookiePreferences): void {
  try {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.error("Error saving cookie preferences:", error)
  }
}

// Get preferences from localStorage
export function getCookiePreferences(): CookiePreferences {
  try {
    const storedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences) as CookiePreferences

      // Check if preferences have expired
      if (preferences.expiresAt && preferences.expiresAt < Date.now()) {
        // If expired, clear preferences and return default
        localStorage.removeItem(COOKIE_PREFERENCES_KEY)
        return { ...defaultPreferences }
      }

      // If no expiration was set in older versions, add it now
      if (!preferences.expiresAt) {
        preferences.expiresAt = getExpirationTimestamp()
        saveCookiePreferences(preferences)
      }

      return preferences
    }
  } catch (error) {
    console.error("Error retrieving cookie preferences:", error)
  }

  // Return default preferences if nothing is stored
  return { ...defaultPreferences }
}

// Check if a specific cookie category is accepted
export function isCookieCategoryAccepted(category: CookieCategory): boolean {
  const preferences = getCookiePreferences()

  // If user hasn't accepted cookies at all, only essential cookies are allowed
  if (!preferences.accepted && category !== CookieCategory.ESSENTIAL) {
    return false
  }

  return preferences.categories[category] || false
}

// Accept all cookie categories
// TODO: update this preferences
export function acceptAllCookies(expirationDays: number = DEFAULT_COOKIE_EXPIRATION_DAYS): void {
  const preferences: CookiePreferences = {
    accepted: true,
    categories: {
      [CookieCategory.ESSENTIAL]: true,
      [CookieCategory.FUNCTIONAL]: true,
      [CookieCategory.ANALYTICS]: true,
      [CookieCategory.MARKETING]: true,
    },
    timestamp: Date.now(),
    expiresAt: getExpirationTimestamp(expirationDays),
    expirationDays
  }

  saveCookiePreferences(preferences)
}

// Accept only essential cookies
// TODO: update this preferences
export function acceptEssentialCookiesOnly(expirationDays: number = DEFAULT_COOKIE_EXPIRATION_DAYS): void {
  const preferences: CookiePreferences = {
    accepted: true,
    categories: {
      [CookieCategory.ESSENTIAL]: true,
      [CookieCategory.FUNCTIONAL]: false,
      [CookieCategory.ANALYTICS]: false,
      [CookieCategory.MARKETING]: false,
    },
    timestamp: Date.now(),
    expiresAt: getExpirationTimestamp(expirationDays),
    expirationDays
  }

  saveCookiePreferences(preferences)
}

// Update specific cookie category
export function updateCookieCategory(category: CookieCategory, accepted: boolean): void {
  const preferences = getCookiePreferences()

  // Cannot disable essential cookies
  if (category === CookieCategory.ESSENTIAL && !accepted) {
    return
  }

  preferences.categories[category] = accepted
  preferences.timestamp = Date.now()

  saveCookiePreferences(preferences)
}

// Check if user has made a cookie choice
export function hasMadeCookieChoice(): boolean {
  try {
    const storedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    return !!storedPreferences
  } catch (error) {
    return false
  }
}

// Check if preferences have expired
export function havePreferencesExpired(): boolean {
  try {
    const preferences = getCookiePreferences()
    return preferences.expiresAt < Date.now()
  } catch (error) {
    return true
  }
}
