'use server'

import { contactSchema } from '@/schemas/contact.schema'
import { z } from 'zod'

const action = async (_: { success: boolean; message: string } | null, formData: FormData) => {
  try {
    // Convert FormData to object
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    // Validate with Zod schema (server-side validation)
    const validated = contactSchema.parse(data)

    // Call internal API route
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(validated),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      return { success: true, message: result.message || 'Thanks for your submission!' }
    } else {
      console.error('[Contact Form] API error:', result)
      return {
        success: false,
        message: result.error || 'Oops! There was a problem submitting your form',
      }
    }
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return {
        success: false,
        message: firstError?.message || 'Invalid form data',
      }
    }

    console.error('[Contact Form] Submission error:', error)
    return {
      success: false,
      message: 'Oops! There was a problem submitting your form',
    }
  }
}

export default action
