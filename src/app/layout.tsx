import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LocaleName, translations } from "@/types/translations";
import { cookies } from "next/headers";
import { THEMES, Themes } from "@/lib/themes";
import { siteConfig, META_THEME_COLORS } from '@/config/site'
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/components/providers/lang-provider";
import { ToasterWithLang } from "./toaster-with-lang";
import { Separator } from "@/components/ui/separator";
import { SessionProvider } from "next-auth/react";
import { CookieConsent } from "@/components/cookies/cookie-consent";
import { CookiePreferencesButton } from "@/components/cookies/cookie-preferences-button";
import { CookieLink } from "@/components/cookies/cookie-link";
import { SettingsProvider } from "@/components/providers/settings-provider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  // metadataBase: new URL('https://wikis.degrassi.es'),
  description: siteConfig.description,
  keywords: [

  ],
  authors: [
    {
      name: 'Alec_016',
      url: ''
    }
  ],
  creator: 'Alec_016',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wikis.degrassi.es',
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [

    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [

    ],
    creator: '@'
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  robots: {
    googleBot: {
      index: true,
      follow: true,
    }
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.dark
}

const LANG_COOKIE = "active_lang"
const THEME_COOKIE = "active_theme"
const DEFAULT_LANG = "en_us"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const initialLang = cookieStore.get(LANG_COOKIE)?.value as LocaleName || DEFAULT_LANG
  const activeThemeValue = cookieStore.get(THEME_COOKIE)?.value as Themes
  const isScaled = activeThemeValue?.endsWith("-scaled")
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : ""
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={THEMES.map(theme => theme.value)}
          >
            <SettingsProvider>
              <LanguageProvider
                defaultLocale={initialLang} 
                fallbackLocale={DEFAULT_LANG}
                translations={translations}
              >
                <div className="flex min-h-screen w-full">
                  <div className="w-full">
                    <CookieConsent />
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
                      <div className="md:col-span-1 w-full">
                        {/* GOOGLE ADDS */}
                      </div>
                      <div className="lg:col-span-3 md:col-span-1 sm:col-span-1 w-full">
                        {children}
                      </div>
                      <div className="md:col-span-1 w-full">
                        {/* GOOGLE ADDS */}
                      </div>
                    </div>
                    <ToasterWithLang />
                    <footer className="w-full">
                      <Separator className="mt-4" />
                      <div className="py-2 px-2 flex justify-between items-center">
                        <div className="text-sm text-gray-500">&copy; {
                          new Date().getFullYear() === siteConfig.startYear ? siteConfig.startYear : `${siteConfig.startYear} - ${new Date().getFullYear()}`
                        } How Long Takes Modpacks</div>
                        <div className="flex gap-4 items-center">
                          <CookieLink />
                          <CookiePreferencesButton />
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </LanguageProvider>
            </SettingsProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
