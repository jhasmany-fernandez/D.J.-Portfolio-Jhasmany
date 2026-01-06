import { NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

const getBackendURL = () => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3001'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// GET all home sections
export async function GET() {
  try {
    const backendURL = getBackendURL()
    console.log('Fetching home sections from backend API:', `${backendURL}/api/home`)

    const response = await fetch(`${backendURL}/api/home`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error response:', errorText)
      throw new Error(`Backend API error: ${response.status}`)
    }

    const homeSections = await response.json()
    console.log('Home sections received from backend:', Array.isArray(homeSections) ? homeSections.length : 'not an array')

    return NextResponse.json({ homeSections: homeSections || [] })
  } catch (error) {
    console.error('Error fetching home sections from backend:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch home sections', details: message }, { status: 500 })
  }
}

// GET active home section
export async function HEAD() {
  try {
    const backendURL = getBackendURL()

    const response = await fetch(`${backendURL}/api/home/active`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ homeSection: null })
    }

    const homeSection = await response.json()
    return NextResponse.json({ homeSection })
  } catch (error) {
    console.error('Error fetching active home section:', error)
    return NextResponse.json({ homeSection: null })
  }
}

// POST create new home section
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const backendURL = getBackendURL()

    console.log('Creating home section on backend:', body.greeting)

    const response = await fetch(`${backendURL}/api/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Backend error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create home section' }, { status: response.status })
    }

    const result = await response.json()
    console.log('Home section created successfully:', result)

    // Revalidate cache to show changes immediately on main page
    revalidateTag('home')
    revalidatePath('/', 'page')

    return NextResponse.json({
      message: 'Home section created successfully',
      homeSection: result
    })
  } catch (error) {
    console.error('Error creating home section:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create home section', details: message }, { status: 500 })
  }
}
