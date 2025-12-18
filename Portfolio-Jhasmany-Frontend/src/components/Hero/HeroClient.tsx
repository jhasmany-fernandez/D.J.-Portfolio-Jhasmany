'use client'

import { useEffect, useState } from 'react'
import Hero from './Hero'

interface HomeSection {
  greeting?: string
  roles?: string[]
  description?: string
  imageUrl?: string
}

interface HeroClientProps {
  initialHomeSection: HomeSection | null
}

export default function HeroClient({ initialHomeSection }: HeroClientProps) {
  const [homeSection, setHomeSection] = useState<HomeSection | null>(initialHomeSection)

  useEffect(() => {
    // Poll for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/home')
        if (response.ok) {
          const data = await response.json()
          const sections = data.homeSections || []
          const activeSection = sections.find((s: any) => s.isActive) || sections[0]
          if (activeSection) {
            setHomeSection({
              greeting: activeSection.greeting,
              roles: activeSection.roles,
              description: activeSection.description,
              imageUrl: activeSection.imageUrl
            })
          }
        }
      } catch (error) {
        console.error('Error fetching home section:', error)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Hero
      greeting={homeSection?.greeting}
      roles={homeSection?.roles}
      description={homeSection?.description}
      imageUrl={homeSection?.imageUrl}
    />
  )
}
