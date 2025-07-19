"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { ToasterProps } from "sonner"

type ToastPosition = ToasterProps['position']

interface SettingsContextType {
  toastPosition: ToastPosition,
  toastPositions: ToastPosition[],
  setToastPosition: (position: ToastPosition) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [toastPosition, setToastPosition] = useState<ToastPosition>('bottom-right')

  const value = useMemo(() => {
    return {
      toastPosition,
      setToastPosition,
      toastPositions: [
        'bottom-center',
        'bottom-left',
        'bottom-right',
        'top-center',
        'top-left',
        'top-right'
      ] as ToastPosition[]
    }
  }, [toastPosition, setToastPosition])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within an AnalyticsProvider")
  }
  return context
}
