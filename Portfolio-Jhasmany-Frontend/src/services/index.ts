import { Project, Testimonial } from '@/lib/types'

type ApiDataResolver<T> = (data: any) => T

const normalizeApiUrl = (url?: string | null) => url?.trim().replace(/\/$/, '')

const getApiBaseUrls = () => {
  const isServer = typeof window === 'undefined'
  const candidates = isServer
    ? [
        process.env.API_URL,
        'http://backend:3001',
        process.env.NEXT_PUBLIC_API_URL,
        'http://localhost:3001',
      ]
    : [
        process.env.NEXT_PUBLIC_SITE_URL,
        process.env.NEXT_PUBLIC_API_URL,
        'http://localhost:3001',
      ]

  return Array.from(
    new Set(candidates.map(normalizeApiUrl).filter(Boolean) as string[])
  )
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

const fetchApiData = async <T>(
  endpoint: string,
  label: string,
  resolveData: ApiDataResolver<T>,
  fallback: T
): Promise<T> => {
  let lastError = 'Unknown error'

  for (const apiUrl of getApiBaseUrls()) {
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        lastError = `HTTP ${response.status}`
        continue
      }

      const data = await response.json()
      return resolveData(data)
    } catch (error) {
      lastError = getErrorMessage(error)
    }
  }

  console.warn(`[${label}] API unavailable at ${endpoint}. Returning fallback. Last error: ${lastError}`)
  return fallback
}

// Internal function to fetch all projects from API
const fetchAllProjectsFromAPI = async (): Promise<Project[]> => {
  return fetchApiData<Project[]>(
    '/api/projects',
    'Projects',
    (data) => Array.isArray(data) ? data : (data.projects || []),
    []
  )
}

// REMOVED: Fallback function - We now always use the database
// const fetchAllProjectsFromFiles = async (): Promise<Project[]> => { ... }

// NO CACHE - Always fetch fresh data from database
const getAllProjects = fetchAllProjectsFromAPI

// Internal function to fetch all services from API
const fetchAllServicesFromAPI = async (): Promise<any[]> => {
  return fetchApiData<any[]>(
    '/api/services',
    'Services',
    (data) => {
      const services = Array.isArray(data) ? data : (data.services || [])
      return services.filter((service: any) => service.isPublished)
    },
    []
  )
}

// NO CACHE - Always fetch fresh data from database
const getAllServices = fetchAllServicesFromAPI

// Internal function to fetch all testimonials from API
const fetchAllTestimonialsFromAPI = async (): Promise<Testimonial[]> => {
  return fetchApiData<Testimonial[]>(
    '/api/testimonials/published',
    'Testimonials',
    (data) => Array.isArray(data) ? data : (data.testimonials || []),
    []
  )
}

// NO CACHE - Always fetch fresh data from database
const getAllTestimonials = fetchAllTestimonialsFromAPI

// Internal function to fetch all skills from API
const fetchAllSkillsFromAPI = async (): Promise<any[]> => {
  return fetchApiData<any[]>(
    '/api/skills',
    'Skills',
    (data) => {
      const skills = Array.isArray(data) ? data : (data.skills || [])
      return skills.filter((skill: any) => skill.isPublished)
    },
    []
  )
}

const getAllSkills = fetchAllSkillsFromAPI

export { getAllProjects, getAllServices, getAllSkills, getAllTestimonials }
