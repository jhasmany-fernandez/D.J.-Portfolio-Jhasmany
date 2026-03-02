import { NextResponse } from 'next/server'
import { getAuthHeader, getBackendUrl } from '../../auth/_utils'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const backendUrl = getBackendUrl()
    const authHeader = await getAuthHeader()
    if (!authHeader.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${backendUrl}/api/users/${id}`, {
      headers: {
        ...authHeader,
      },
      cache: 'no-store',
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to fetch user' },
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const backendUrl = getBackendUrl()
    const authHeader = await getAuthHeader()
    if (!authHeader.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${backendUrl}/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(body),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to update user' },
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const backendUrl = getBackendUrl()
    const authHeader = await getAuthHeader()
    if (!authHeader.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${backendUrl}/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    })
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: result.message || 'Failed to delete user' },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

