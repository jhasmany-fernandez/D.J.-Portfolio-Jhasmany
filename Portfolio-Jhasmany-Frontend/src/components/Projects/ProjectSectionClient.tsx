'use client'

import { Project } from '@/lib/types'
import { useEffect, useState } from 'react'
import ProjectSection from './ProjectSection'

interface ProjectSectionClientProps {
  initialProjects: Project[]
}

export default function ProjectSectionClient({ initialProjects }: ProjectSectionClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  useEffect(() => {
    // Poll for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          const freshProjects = Array.isArray(data) ? data : (data.projects || [])
          setProjects(freshProjects)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return <ProjectSection projects={projects} />
}
