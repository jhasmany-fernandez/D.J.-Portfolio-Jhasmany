import { NextResponse } from 'next/server'
import { getAuthHeader, getBackendUrl } from '../_utils'

export async function GET() {
  try {
    const backendUrl = getBackendUrl()
    const authHeader = await getAuthHeader()
    if (!authHeader.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${backendUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        ...authHeader,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: response.status })
    }

    const user = await response.json()
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

