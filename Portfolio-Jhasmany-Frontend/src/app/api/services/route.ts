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

// GET all services
export async function GET() {
  try {
    const response = await fetchBackend('/api/services', {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error response:', errorText)
      throw new Error(`Backend API error: ${response.status}`)
    }

    const services = await response.json()

    // Sort by order
    if (Array.isArray(services)) {
      services.sort((a, b) => (a.order || 0) - (b.order || 0))
      return NextResponse.json({ services: services })
    }

    return NextResponse.json({ services: services || [] })
  } catch (error) {
    console.error('Error fetching services from backend:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch services', details: message }, { status: 500 })
  }
}

// POST create new service
export async function POST(request: Request) {
  try {
    const body = await request.json()


    const response = await fetchBackend('/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = 'Failed to create service'
      try {
        const parsed = JSON.parse(errorText)
        errorMessage = parsed?.message || parsed?.error || errorMessage
      } catch {
        if (errorText) {
          errorMessage = errorText
        }
      }
      console.error('Backend error:', { status: response.status, url: response.url, errorText })
      return NextResponse.json(
        { error: errorMessage, backendUrl: response.url, status: response.status },
        { status: response.status }
      )
    }

    const result = await response.json()

    revalidateTag('services')

    return NextResponse.json({
      message: 'Service created successfully',
      service: result
    })
  } catch (error) {
    console.error('Error creating service:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create service', details: message }, { status: 500 })
  }
}
