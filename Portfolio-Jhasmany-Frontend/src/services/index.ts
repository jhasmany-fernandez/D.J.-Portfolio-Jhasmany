import { Project, Testimonial } from '@/lib/types'
import { promises as fs } from 'fs'
import { unstable_cache } from 'next/cache'
import path from 'path'

// Note: fs and path imports still needed for testimonials

// Internal function to fetch all projects from API
const fetchAllProjectsFromAPI = async (): Promise<Project[]> => {
  try {
    // Check if we're running server-side (inside Docker container)
    const isServer = typeof window === 'undefined'

    // Server-side: call backend directly using Docker service name
    // Client-side: use the frontend's API route proxy
    const apiUrl = isServer
      ? (process.env.API_URL || 'http://backend:3001')  // Direct backend call during SSR
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002') // Frontend proxy for client

    console.log('[fetchAllProjectsFromAPI] Fetching from:', `${apiUrl}/api/projects`, 'isServer:', isServer)

    const response = await fetch(`${apiUrl}/api/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Always get fresh data for SSR
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[fetchAllProjectsFromAPI] API error:', response.status, errorText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response formats:
    // - Backend returns array directly: [{...}]
    // - Frontend API route returns object: {projects: [{...}]}
    const projects = Array.isArray(data) ? data : (data.projects || [])

    console.log('[fetchAllProjectsFromAPI] Received projects:', projects.length)
    return projects
  } catch (error) {
    console.error('[fetchAllProjectsFromAPI] Fatal error - NO FALLBACK:', error)
    // NO FALLBACK - Force using the database
    return []
  }
}

// REMOVED: Fallback function - We now always use the database
// const fetchAllProjectsFromFiles = async (): Promise<Project[]> => { ... }

// NO CACHE - Always fetch fresh data from database
const getAllProjects = fetchAllProjectsFromAPI

// Internal function to fetch all services from API
const fetchAllServicesFromAPI = async (): Promise<any[]> => {
  try {
    // Check if we're running server-side (inside Docker container)
    const isServer = typeof window === 'undefined'

    // Server-side: call backend directly using Docker service name
    // Client-side: use the frontend's API route proxy
    const apiUrl = isServer
      ? (process.env.API_URL || 'http://backend:3001')  // Direct backend call during SSR
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002') // Frontend proxy for client

    console.log('[fetchAllServicesFromAPI] Fetching from:', `${apiUrl}/api/services`, 'isServer:', isServer)

    const response = await fetch(`${apiUrl}/api/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Always get fresh data for SSR
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[fetchAllServicesFromAPI] API error:', response.status, errorText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response formats:
    // - Backend returns array directly: [{...}]
    // - Frontend API route returns object: {services: [{...}]}
    const services = Array.isArray(data) ? data : (data.services || [])

    // Filter only published services
    const publishedServices = services.filter((service: any) => service.isPublished)

    console.log('[fetchAllServicesFromAPI] Received services:', publishedServices.length)
    return publishedServices
  } catch (error) {
    console.error('[fetchAllServicesFromAPI] Fatal error - NO FALLBACK:', error)
    return []
  }
}

// NO CACHE - Always fetch fresh data from database
const getAllServices = fetchAllServicesFromAPI

// Internal function to fetch all testimonials from API
const fetchAllTestimonialsFromAPI = async (): Promise<Testimonial[]> => {
  try {
    const isServer = typeof window === 'undefined'
    const apiUrl = isServer
      ? (process.env.API_URL || 'http://backend:3001')
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002')

    console.log('[fetchAllTestimonialsFromAPI] Fetching from:', `${apiUrl}/api/testimonials`, 'isServer:', isServer)

    const response = await fetch(`${apiUrl}/api/testimonials/published`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[fetchAllTestimonialsFromAPI] API error:', response.status, errorText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const testimonials = Array.isArray(data) ? data : (data.testimonials || [])

    console.log('[fetchAllTestimonialsFromAPI] Received testimonials:', testimonials.length)
    return testimonials
  } catch (error) {
    console.error('[fetchAllTestimonialsFromAPI] Fatal error - NO FALLBACK:', error)
    return []
  }
}

// NO CACHE - Always fetch fresh data from database
const getAllTestimonials = fetchAllTestimonialsFromAPI

// Internal function to fetch all skills from API
const fetchAllSkillsFromAPI = async (): Promise<any[]> => {
  try {
    const isServer = typeof window === 'undefined'
    const apiUrl = isServer
      ? (process.env.API_URL || 'http://backend:3001')
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002')

    console.log('[fetchAllSkillsFromAPI] Fetching from:', `${apiUrl}/api/skills`, 'isServer:', isServer)

    const response = await fetch(`${apiUrl}/api/skills`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[fetchAllSkillsFromAPI] API error:', response.status, errorText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const skills = Array.isArray(data) ? data : (data.skills || [])
    const publishedSkills = skills.filter((skill: any) => skill.isPublished)

    console.log('[fetchAllSkillsFromAPI] Received skills:', publishedSkills.length)
    return publishedSkills
  } catch (error) {
    console.error('[fetchAllSkillsFromAPI] Fatal error - NO FALLBACK:', error)
    return []
  }
}

const getAllSkills = fetchAllSkillsFromAPI

export { getAllProjects, getAllServices, getAllSkills, getAllTestimonials }
