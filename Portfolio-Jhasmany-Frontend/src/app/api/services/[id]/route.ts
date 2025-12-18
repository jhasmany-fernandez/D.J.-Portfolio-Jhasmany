import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const getBackendURL = () => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3001'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// GET single service
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendURL = getBackendURL()
    const { id } = await params
    const response = await fetch(`${backendURL}/api/services/${id}`, {
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
    const backendURL = getBackendURL()
    const { id } = await params

    const response = await fetch(`${backendURL}/api/services/${id}`, {
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
    const backendURL = getBackendURL()
    const { id } = await params

    const response = await fetch(`${backendURL}/api/services/${id}`, {
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
