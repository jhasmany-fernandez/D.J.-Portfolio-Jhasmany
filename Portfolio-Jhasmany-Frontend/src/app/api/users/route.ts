import { NextResponse } from 'next/server'
import { getAuthHeader, getBackendUrl } from '../auth/_utils'

export async function GET() {
  try {
    const backendUrl = getBackendUrl()
    const authHeader = await getAuthHeader()
    if (!authHeader.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${backendUrl}/api/users`, {
      headers: {
        ...authHeader,
      },
      cache: 'no-store',
    })

    const result = await response.json().catch(() => [])
    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to fetch users' },
        { status: response.status },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const backendUrl = getBackendUrl()
    const authHeader = await getAuthHeader()
    if (!authHeader.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${backendUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(body),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to create user' },
        { status: response.status },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

