import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const getBackendURL = () => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3001'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// GET single skill
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendURL = getBackendURL()
    const { id } = await params
    const response = await fetch(`${backendURL}/api/skills/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const skill = await response.json()
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error fetching skill:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch skill', details: message }, { status: 500 })
  }
}

// Shared update logic for PUT and PATCH
async function updateSkill(
  request: Request,
  params: { id: string }
) {
  try {
    console.log('[Skills API] Updating skill:', params.id)
    const body = await request.json()
    console.log('[Skills API] Request body:', JSON.stringify(body).substring(0, 100))
    const backendURL = getBackendURL()
    console.log('[Skills API] Backend URL:', `${backendURL}/api/skills/${params.id}`)

    const response = await fetch(`${backendURL}/api/skills/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('[Skills API] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Skills API] Backend error:', response.status, errorText)
      try {
        const error = JSON.parse(errorText)
        return NextResponse.json({ error: error.message || 'Failed to update skill' }, { status: response.status })
      } catch {
        return NextResponse.json({ error: errorText || 'Failed to update skill' }, { status: response.status })
      }
    }

    const result = await response.json()
    console.log('[Skills API] Update successful')
    revalidateTag('skills')

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Skills API] Error updating skill:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update skill', details: message }, { status: 500 })
  }
}

// PUT update skill
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateSkill(request, await params)
}

// PATCH update skill
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateSkill(request, await params)
}

// DELETE skill
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendURL = getBackendURL()
    const { id } = await params
    const response = await fetch(`${backendURL}/api/skills/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    revalidateTag('skills')
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting skill:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to delete skill', details: message }, { status: 500 })
  }
}
