'use client'

import { useEffect, useState } from 'react'
import Skills from './Skills'

interface Skill {
  id: string
  name: string
  icon?: string
  imageUrl?: string
  isPublished: boolean
}

interface SkillsClientProps {
  initialSkills: Skill[]
}

export default function SkillsClient({ initialSkills }: SkillsClientProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)

  useEffect(() => {
    // Poll for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/skills')
        if (response.ok) {
          const data = await response.json()
          const freshSkills = Array.isArray(data) ? data : (data.skills || [])
          // Filter only published skills
          const publishedSkills = freshSkills.filter((skill: Skill) => skill.isPublished)
          setSkills(publishedSkills)
        }
      } catch (error) {
        console.error('Error fetching skills:', error)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Format skills for the Skills component
  const formattedSkills = skills.map(skill => ({
    name: skill.name,
    icon: skill.imageUrl || skill.icon || '📦'
  }))

  return <Skills skills={formattedSkills} />
}
