'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'En' | 'Es' | 'Fr' | 'De' | 'Ru'

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  availableLanguages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('En')
  const availableLanguages: Language[] = ['En', 'Es', 'Fr', 'De', 'Ru']

  const getLanguageFromCookie = (): Language | null => {
    if (typeof document === 'undefined') return null
    const rawCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('portfolio-language='))
      ?.split('=')[1]

    if (!rawCookie) return null
    const decoded = decodeURIComponent(rawCookie) as Language
    return availableLanguages.includes(decoded) ? decoded : null
  }

  const setLanguageCookie = (language: Language) => {
    if (typeof document === 'undefined') return
    document.cookie = `portfolio-language=${encodeURIComponent(language)}; Path=/; Max-Age=31536000; SameSite=Lax`
  }

  // Load saved language from cookie on mount
  useEffect(() => {
    const savedLanguage = getLanguageFromCookie()
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    setLanguageCookie(language)

    // Add a console log to show the language change
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
