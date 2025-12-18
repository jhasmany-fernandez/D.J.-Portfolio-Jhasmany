import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const getBackendURL = () => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3001'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// GET all skills
export async function GET() {
  try {
    const backendURL = getBackendURL()
    console.log('Fetching skills from backend API:', `${backendURL}/api/skills`)

    const response = await fetch(`${backendURL}/api/skills`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error response:', errorText)
      throw new Error(`Backend API error: ${response.status}`)
    }

    const skills = await response.json()
    console.log('Skills received from backend:', Array.isArray(skills) ? skills.length : 'not an array')

    // Sort by order
    if (Array.isArray(skills)) {
      skills.sort((a, b) => (a.order || 0) - (b.order || 0))
      return NextResponse.json({ skills: skills })
    }

    return NextResponse.json({ skills: skills || [] })
  } catch (error) {
    console.error('Error fetching skills from backend:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch skills', details: message }, { status: 500 })
  }
}

// POST create new skill
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const backendURL = getBackendURL()

    console.log('Creating skill on backend:', body.name)

    const response = await fetch(`${backendURL}/api/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Backend error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create skill' }, { status: response.status })
    }

    const result = await response.json()
    console.log('Skill created successfully:', result)

    revalidateTag('skills')

    return NextResponse.json({
      message: 'Skill created successfully',
      skill: result
    })
  } catch (error) {
    console.error('Error creating skill:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create skill', details: message }, { status: 500 })
  }
}
