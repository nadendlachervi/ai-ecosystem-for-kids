import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

interface AccessibilityContextType {
  fontSize: string
  highContrast: boolean
  setFontSize: (size: string) => void
  setHighContrast: (enabled: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState("medium")
  const [highContrast, setHighContrast] = useState(false)

  return (
    <AccessibilityContext.Provider value={{ fontSize, highContrast, setFontSize, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

