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
    let isMounted = true

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          const freshProjects = Array.isArray(data) ? data : (data.projects || [])
          if (isMounted) {
            setProjects(freshProjects)
          }
        }
      } catch (error) {
        // Keep server-rendered projects if the client request is interrupted.
      }
    }

    fetchProjects()

    return () => {
      isMounted = false
    }
  }, [])

  return <ProjectSection projects={projects} />
}
