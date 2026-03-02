import { contactSchema } from '@/schemas/contact.schema'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate with Zod schema
    const validated = contactSchema.parse(body)

    // If you have an external service (like FormSpree, SendGrid, etc.)
    // Send to external service
    const externalUrl = process.env.CONTACT_FORM_ACTION_URL

    if (externalUrl) {
      const formData = new FormData()
      formData.append('name', validated.name)
      formData.append('email', validated.email)
      formData.append('subject', validated.subject)
      formData.append('message', validated.message)

      const response = await fetch(externalUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('[Contact API] External service error:', errorData)

        return NextResponse.json(
          {
            success: false,
            error: 'Failed to send message to external service',
          },
          { status: 500 },
        )
      }
    } else {
      // No external contact provider configured.
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks for your submission!',
    })
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          details: error.issues,
        },
        { status: 400 },
      )
    }

    // Handle other errors
    console.error('[Contact API] Unexpected error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 },
    )
  }
}
