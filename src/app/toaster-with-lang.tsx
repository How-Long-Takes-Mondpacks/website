'use client'
import { useI18n } from "@/components/providers/lang-provider"
import { useSettings } from "@/components/providers/settings-provider"
import { useTheme } from "next-themes"
import { Toaster, ToasterProps } from "sonner"

export function ToasterWithLang() {
  const { isRtl } = useI18n()
  const { toastPosition } = useSettings()
  const { theme } = useTheme()
  return (
    <Toaster richColors closeButton dir={isRtl ? 'rtl' : 'ltr'} swipeDirections={['left', 'right']} position={toastPosition} theme={theme as ToasterProps['theme'] ??'dark'} />
  )
}