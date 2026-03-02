'use server'

import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '@/schemas/auth.schema'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL || 'http://backend:3001'

export async function loginAction(prevState: unknown, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
    }
  }

  const { email, password } = validatedFields.data

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      if (data.access_token) {
        const cookieStore = await cookies()
        cookieStore.set('auth_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
      }

      return {
        success: true,
        message: 'Login successful! Redirecting...',
        redirect: '/dashboard'
      }
    } else {
      // Handle different error response structures
      const errorMessage = data.message?.message || data.message || 'Invalid credentials. Please try again.';
      return {
        success: false,
        message: errorMessage,
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}

export async function registerAction(prevState: unknown, formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
    }
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        message: 'Account created successfully! Please log in.',
      }
    } else {
      return {
        success: false,
        message: data.message || 'Failed to create account. Please try again.',
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      message: 'Failed to create account. Please try again.',
    }
  }
}

export async function forgotPasswordAction(prevState: unknown, formData: FormData) {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    }
  }

  const { email } = validatedFields.data

  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'If the email exists, a password reset link has been sent.',
      }
    } else {
      return {
        success: false,
        error: data.message || 'Failed to send reset email. Please try again.',
      }
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}

export async function resetPasswordAction(prevState: unknown, formData: FormData) {
  const validatedFields = resetPasswordSchema.safeParse({
    token: formData.get('token'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    }
  }

  const { token, newPassword, confirmPassword } = validatedFields.data

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match',
    }
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Password has been reset successfully',
      }
    } else {
      return {
        success: false,
        error: data.message || 'Failed to reset password. Please try again.',
      }
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}
