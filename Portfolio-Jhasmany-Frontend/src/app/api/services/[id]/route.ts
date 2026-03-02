import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const getBackendCandidates = () => {
  const normalizeHost = (url?: string) => url?.replace('://localhost', '://127.0.0.1')
  const fromEnv = normalizeHost(process.env.API_URL)
  const publicEnv = normalizeHost(process.env.NEXT_PUBLIC_API_URL)
  const urls = ['http://127.0.0.1:3001', fromEnv, publicEnv, 'http://localhost:3001', 'http://backend:3001']
  return Array.from(new Set(urls.filter(Boolean))) as string[]
}

const fetchBackend = async (path: string, init?: RequestInit) => {
  const candidates = getBackendCandidates()
  let lastError: unknown

  for (const baseUrl of candidates) {
    try {
      return await fetch(`${baseUrl}${path}`, init)
    } catch (error) {
      lastError = error
      console.error(`Backend request failed for ${baseUrl}${path}`, error)
    }
  }

  throw lastError instanceof Error ? lastError : new Error('No backend URL reachable')
}

// GET single service
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const response = await fetchBackend(`/api/services/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Failed to fetch service' }, { status: response.status })
    }

    const service = await response.json()
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch service', details: message }, { status: 500 })
  }
}

// PATCH update service
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params

    const response = await fetchBackend(`/api/services/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: response.status })
    }

    const result = await response.json()
    revalidateTag('services')

    return NextResponse.json({
      message: 'Service updated successfully',
      service: result
    })
  } catch (error) {
    console.error('Error updating service:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update service', details: message }, { status: 500 })
  }
}

// DELETE service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const response = await fetchBackend(`/api/services/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Failed to delete service' }, { status: response.status })
    }

    revalidateTag('services')

    return NextResponse.json({
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to delete service', details: message }, { status: 500 })
  }
}
