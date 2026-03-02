import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Use Docker service name for internal communication (SSR)
const getBackendURL = () => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3001'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// GET project by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const backendURL = getBackendURL()

    const response = await fetch(`${backendURL}/api/projects/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      throw new Error(`Backend API error: ${response.status}`)
    }

    const project = await response.json()
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch project', details: message }, { status: 500 })
  }
}

// PUT update project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const backendURL = getBackendURL()


    // TODO: Add authentication token from session
    const response = await fetch(`${backendURL}/api/projects/${id}`, {
      method: 'PATCH', // NestJS uses PATCH for partial updates
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add Authorization header with JWT token
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Backend error:', error)
      return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: response.status })
    }

    const result = await response.json()

    // Invalidate the projects cache to show updates immediately
    revalidateTag('projects')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating project:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update project', details: message }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const backendURL = getBackendURL()

    // TODO: Add authentication token from session
    const response = await fetch(`${backendURL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        // TODO: Add Authorization header with JWT token
        // 'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Backend error:', error)
      return NextResponse.json({ error: error.message || 'Failed to delete project' }, { status: response.status })
    }

    // Invalidate the projects cache to show updates immediately
    revalidateTag('projects')

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to delete project', details: message }, { status: 500 })
  }
}
