'use client'

import { useEffect, useState } from 'react'
import Hero from './Hero'

interface HomeSection {
  greeting?: string
  roles?: string[]
  description?: string
  imageUrl?: string
  primaryButtonText?: string
  primaryButtonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
}

interface HeroClientProps {
  initialHomeSection: HomeSection | null
}

export default function HeroClient({ initialHomeSection }: HeroClientProps) {
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
              roles: activeSection.roles,
              description: activeSection.description,
              imageUrl: activeSection.imageUrl,
              primaryButtonText: activeSection.primaryButtonText,
              primaryButtonUrl: activeSection.primaryButtonUrl,
              secondaryButtonText: activeSection.secondaryButtonText,
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
      greeting={homeSection?.greeting}
      roles={homeSection?.roles}
      description={homeSection?.description}
      imageUrl={homeSection?.imageUrl}
      primaryButtonText={homeSection?.primaryButtonText}
      primaryButtonUrl={homeSection?.primaryButtonUrl}
      secondaryButtonText={homeSection?.secondaryButtonText}
      secondaryButtonUrl={homeSection?.secondaryButtonUrl}
    />
  )
}
