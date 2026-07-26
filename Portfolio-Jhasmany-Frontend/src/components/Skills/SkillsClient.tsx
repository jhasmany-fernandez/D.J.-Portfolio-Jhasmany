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
    let isMounted = true

    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills')
        if (response.ok) {
          const data = await response.json()
          const freshSkills = Array.isArray(data) ? data : (data.skills || [])
          const publishedSkills = freshSkills.filter((skill: Skill) => skill.isPublished)
          if (isMounted) {
            setSkills(publishedSkills)
          }
        }
      } catch (error) {
        // Keep server-rendered skills if the client request is interrupted.
      }
    }

    fetchSkills()

    return () => {
      isMounted = false
    }
  }, [])

  // Format skills for the Skills component
  const formattedSkills = skills.map(skill => ({
    name: skill.name,
    icon: skill.imageUrl || skill.icon || '📦'
  }))

  return <Skills skills={formattedSkills} />
}
