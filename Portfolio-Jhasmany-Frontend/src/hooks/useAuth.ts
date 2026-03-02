'use client'

import { authService } from '@/services/auth'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser || null)
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    if (response.success && response.user) {
      setUser(response.user)
    }
    return response
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const isAuthenticated = () => {
    return !!user
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  }
}
