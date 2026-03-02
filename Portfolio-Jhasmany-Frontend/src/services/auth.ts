import type { LoginFormData, RegisterFormData } from '@/schemas/auth.schema'

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    name: string
    email: string
  }
  token?: string
}

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        return {
          success: false,
          message: payload.error || payload.message || 'Login failed. Please try again.',
        }
      }

      return {
        success: true,
        message: payload.message || 'Login successful',
        user: payload.user,
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Login failed. Please try again.',
      }
    }
  },

  async register(data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        return {
          success: false,
          message: payload.error || payload.message || 'Registration failed. Please try again.',
        }
      }

      return {
        success: true,
        message: payload.message || 'Registration successful',
        user: payload.user,
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) {
        return null
      }

      const payload = await response.json()
      return payload.user || null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  getToken(): string | null {
    return null
  },

  isAuthenticated(): boolean {
    return false
  },
}
