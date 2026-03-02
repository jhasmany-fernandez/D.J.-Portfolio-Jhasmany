import { NextResponse } from 'next/server'
import { getBackendUrl } from '../_utils'

const COOKIE_NAME = 'auth_token'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const backendUrl = getBackendUrl()

    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const nestedMessage =
        typeof result?.message?.message === 'string'
          ? result.message.message
          : typeof result?.error?.message === 'string'
            ? result.error.message
            : null
      const errorMessage =
        nestedMessage ||
        (typeof result?.message === 'string'
          ? result.message
          : typeof result?.error === 'string'
            ? result.error
            : 'Invalid credentials')
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      )
    }

    const token = result.access_token
    if (!token) {
      return NextResponse.json({ error: 'Token not provided by backend' }, { status: 500 })
    }

    const res = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: result.user,
    })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
