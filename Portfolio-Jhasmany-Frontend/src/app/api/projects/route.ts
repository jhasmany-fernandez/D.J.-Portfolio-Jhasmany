import { Project } from '@/lib/types'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Use Docker service name for internal communication (SSR)
// Fall back to localhost for client-side or development
const getBackendURL = () => {
  // Check if we're running in server-side (Node.js) context
  if (typeof window === 'undefined') {
    // Server-side: use Docker service name
    return process.env.API_URL || 'http://backend:3001'
  }
  // Client-side: use public URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// GET all projects
export async function GET() {
  try {
    const backendURL = getBackendURL()

    const response = await fetch(`${backendURL}/api/projects`, {
      cache: 'no-store', // Disable caching for real-time data
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error response:', errorText)
      throw new Error(`Backend API error: ${response.status}`)
    }

    const projects = await response.json()

    // Sort by priority
    if (Array.isArray(projects)) {
      projects.sort((a, b) => (a.priority || 0) - (b.priority || 0))
      return NextResponse.json({ projects: projects })
    }

    // Backend might return projects directly or wrapped
    return NextResponse.json({ projects: projects || [] })
  } catch (error) {
    console.error('Error fetching projects from backend:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch projects', details: message }, { status: 500 })
  }
}

// POST create new project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const project: Project = body
    const backendURL = getBackendURL()


    // TODO: Add authentication token from session
    const response = await fetch(`${backendURL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add Authorization header with JWT token
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Backend error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: response.status })
    }

    const result = await response.json()

    // Invalidate the projects cache to show new project immediately
    revalidateTag('projects')

    return NextResponse.json({
      message: 'Project created successfully',
      project: result
    })
  } catch (error) {
    console.error('Error creating project:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create project', details: message }, { status: 500 })
  }
}
