import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Use Docker service name for internal communication (SSR)
const getBackendURL = () => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3001'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// GET all services
export async function GET() {
  try {
    const backendURL = getBackendURL()
    console.log('Fetching services from backend API:', `${backendURL}/api/services`)

    const response = await fetch(`${backendURL}/api/services`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error response:', errorText)
      throw new Error(`Backend API error: ${response.status}`)
    }

    const services = await response.json()
    console.log('Services received from backend:', Array.isArray(services) ? services.length : 'not an array')

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
    const backendURL = getBackendURL()

    console.log('Creating service on backend:', body.title)

    const response = await fetch(`${backendURL}/api/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Backend error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create service' }, { status: response.status })
    }

    const result = await response.json()
    console.log('Service created successfully:', result)

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
