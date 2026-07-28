'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'En' | 'Es'

const translations = {
  En: {
    'nav.home': '_home',
    'nav.projects': '_projects',
    'nav.services': '_services',
    'nav.testimonials': '_testimonials',
    'nav.login': '_login',
    'route.login': 'login',
    'route.register': 'register',
    'route.subscribe': 'subscribe',
    'brand.name': 'Jhasmany_Fernandez',
    'section.projects': '// Projects',
    'section.services': '// Services / Offers:',
    'section.testimonials': '// Testimonials',
    'empty.services': 'No services available at the moment.',
    'empty.testimonials': 'No testimonials available at the moment.',
    'footer.moreAbout': 'More about me',
    'footer.contact': 'Contact Us',
    'footer.location': 'Location',
    'footer.languages': 'Languages',
    'footer.rights': 'All Rights reserved',
    'footer.home': 'Home',
    'footer.projects': 'Projects',
    'footer.services': 'Services',
    'footer.testimonials': 'Testimonials',
    'project.visitors': 'Visitors',
    'project.earned': 'Earned',
    'project.stars': 'Stars',
    'project.rating': 'Rating',
    'project.sales': 'Sales',
    'project.old': 'old',
    'project.preview': 'Live Preview',
    'project.github': 'Github Link',
    'project.close': 'Close',
    'service.more': 'more',
  },
  Es: {
    'nav.home': '_inicio',
    'nav.projects': '_proyectos',
    'nav.services': '_servicios',
    'nav.testimonials': '_testimonios',
    'nav.login': '_ingresar',
    'route.login': 'ingresar',
    'route.register': 'registro',
    'route.subscribe': 'suscripcion',
    'brand.name': 'Jhasmany_Fernandez',
    'section.projects': '// Proyectos',
    'section.services': '// Servicios / Ofertas:',
    'section.testimonials': '// Testimonios',
    'empty.services': 'No hay servicios disponibles por el momento.',
    'empty.testimonials': 'No hay testimonios disponibles por el momento.',
    'footer.moreAbout': 'Mas sobre mi',
    'footer.contact': 'Contacto',
    'footer.location': 'Ubicacion',
    'footer.languages': 'Idiomas',
    'footer.rights': 'Todos los derechos reservados',
    'footer.home': 'Inicio',
    'footer.projects': 'Proyectos',
    'footer.services': 'Servicios',
    'footer.testimonials': 'Testimonios',
    'project.visitors': 'Visitantes',
    'project.earned': 'Ganado',
    'project.stars': 'Estrellas',
    'project.rating': 'Calificacion',
    'project.sales': 'Ventas',
    'project.old': 'antiguedad',
    'project.preview': 'Vista previa',
    'project.github': 'Enlace Github',
    'project.close': 'Cerrar',
    'service.more': 'mas',
  },
} as const

type TranslationKey = keyof typeof translations.En

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  availableLanguages: Language[]
  t: (key: TranslationKey) => string
}

const availableLanguages: Language[] = ['En', 'Es']
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const normalizeLanguage = (value: string): Language => {
  return value.toLowerCase() === 'es' ? 'Es' : 'En'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('En')

  const getLanguageFromCookie = (): Language | null => {
    if (typeof document === 'undefined') return null
    const rawCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('portfolio-language='))
      ?.split('=')[1]

    return rawCookie ? normalizeLanguage(decodeURIComponent(rawCookie)) : null
  }

  const setLanguageCookie = (language: Language) => {
    if (typeof document === 'undefined') return
    document.cookie = `portfolio-language=${encodeURIComponent(language)}; Path=/; Max-Age=31536000; SameSite=Lax`
  }

  useEffect(() => {
    const savedLanguage = getLanguageFromCookie()
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    setLanguageCookie(language)
  }

  const t = (key: TranslationKey) => translations[currentLanguage][key] || translations.En[key]

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, availableLanguages, t }}>
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
