'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { pickLocalizedArray, pickLocalizedText } from '@/utils/i18n'
import Hero from './Hero'

interface HomeSection {
  greeting?: string
  greetingEs?: string
  roles?: string[]
  rolesEs?: string[]
  description?: string
  descriptionEs?: string
  imageUrl?: string
  primaryButtonText?: string
  primaryButtonTextEs?: string
  primaryButtonUrl?: string
  secondaryButtonText?: string
  secondaryButtonTextEs?: string
  secondaryButtonUrl?: string
}

interface HeroClientProps {
  initialHomeSection: HomeSection | null
}

export default function HeroClient({ initialHomeSection }: HeroClientProps) {
  const { currentLanguage } = useLanguage()
  const [homeSection, setHomeSection] = useState<HomeSection | null>(initialHomeSection)

  useEffect(() => {
    let isMounted = true

    const fetchHomeSection = async () => {
      try {
        const response = await fetch('/api/home')
        if (response.ok) {
          const data = await response.json()
          const sections = data.homeSections || []
          const activeSection = sections.find((s: any) => s.isActive) || sections[0]
          if (activeSection && isMounted) {
            setHomeSection({
              greeting: activeSection.greeting,
              greetingEs: activeSection.greetingEs,
              roles: activeSection.roles,
              rolesEs: activeSection.rolesEs,
              description: activeSection.description,
              descriptionEs: activeSection.descriptionEs,
              imageUrl: activeSection.imageUrl,
              primaryButtonText: activeSection.primaryButtonText,
              primaryButtonTextEs: activeSection.primaryButtonTextEs,
              primaryButtonUrl: activeSection.primaryButtonUrl,
              secondaryButtonText: activeSection.secondaryButtonText,
              secondaryButtonTextEs: activeSection.secondaryButtonTextEs,
              secondaryButtonUrl: activeSection.secondaryButtonUrl,
            })
          }
        }
      } catch (error) {
        // Keep server-rendered content if the client request is interrupted.
      }
    }

    fetchHomeSection()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Hero
      greeting={homeSection ? pickLocalizedText(homeSection, 'greeting', currentLanguage) : undefined}
      roles={homeSection ? pickLocalizedArray(homeSection, 'roles', currentLanguage) : undefined}
      description={homeSection ? pickLocalizedText(homeSection, 'description', currentLanguage) : undefined}
      imageUrl={homeSection?.imageUrl}
      primaryButtonText={homeSection ? pickLocalizedText(homeSection, 'primaryButtonText', currentLanguage) : undefined}
      primaryButtonUrl={homeSection?.primaryButtonUrl}
      secondaryButtonText={homeSection ? pickLocalizedText(homeSection, 'secondaryButtonText', currentLanguage) : undefined}
      secondaryButtonUrl={homeSection?.secondaryButtonUrl}
    />
  )
}
