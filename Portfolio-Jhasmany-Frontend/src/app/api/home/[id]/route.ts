import { NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

const getBackendURL = () => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3001'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// GET single home section by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendURL = getBackendURL()
    const { id } = await params

    const response = await fetch(`${backendURL}/api/home/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Home section not found' }, { status: 404 })
    }

    const homeSection = await response.json()
    return NextResponse.json({ homeSection })
  } catch (error) {
    console.error('Error fetching home section:', error)
    return NextResponse.json({ error: 'Failed to fetch home section' }, { status: 500 })
  }
}

// PATCH update home section
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const backendURL = getBackendURL()
    const { id } = await params

    console.log('[Home API] Backend URL:', `${backendURL}/api/home/${id}`)

    const response = await fetch(`${backendURL}/api/home/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('[Home API] Response status:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('[Home API] Error:', error)
      return NextResponse.json({ error: error.message || 'Failed to update home section' }, { status: response.status })
    }

    const result = await response.json()
    console.log('[Home API] Success:', result)

    // Revalidate cache to show changes immediately on main page
    revalidateTag('home')
    revalidatePath('/', 'page')

    return NextResponse.json({
      message: 'Home section updated successfully',
      homeSection: result
    })
  } catch (error) {
    console.error('Error updating home section:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update home section', details: message }, { status: 500 })
  }
}

// PATCH set home section as active
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendURL = getBackendURL()
    const { id } = await params

    const response = await fetch(`${backendURL}/api/home/${id}/set-active`, {
      method: 'PATCH',
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Failed to set active' }, { status: response.status })
    }

    const result = await response.json()

    // Revalidate cache to show changes immediately on main page
    revalidateTag('home')
    revalidatePath('/', 'page')

    return NextResponse.json({
      message: 'Home section set as active',
      homeSection: result
    })
  } catch (error) {
    console.error('Error setting home section as active:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to set active', details: message }, { status: 500 })
  }
}

// DELETE home section
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendURL = getBackendURL()
    const { id } = await params

    const response = await fetch(`${backendURL}/api/home/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Failed to delete home section' }, { status: response.status })
    }

    // Revalidate cache to show changes immediately on main page
    revalidateTag('home')
    revalidatePath('/', 'page')

    return NextResponse.json({ message: 'Home section deleted successfully' })
  } catch (error) {
    console.error('Error deleting home section:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to delete home section', details: message }, { status: 500 })
  }
}
