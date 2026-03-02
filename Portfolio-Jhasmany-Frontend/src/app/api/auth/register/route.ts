import { NextResponse } from 'next/server'
import { getBackendUrl } from '../_utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const backendUrl = getBackendUrl()
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Registration failed' },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: result,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

