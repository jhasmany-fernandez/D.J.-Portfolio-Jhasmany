export interface User {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  email: string
  name: string
  password: string
  role?: string
}

export interface UpdateUserData {
  email?: string
  name?: string
  password?: string
  role?: string
  isActive?: boolean
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }
      const data = await response.json()
      const normalized = Array.isArray(data) ? data : data.users || []
      return normalized as User[]
    } catch (error) {
      console.error('Get all users error:', error)
      throw error
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`)
      }
      const data = await response.json()
      return data as User
    } catch (error) {
      console.error('Get user by ID error:', error)
      throw error
    }
  },

  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`)
      }
      const result = await response.json()
      return result as User
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`)
      }
      const result = await response.json()
      return result as User
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`)
      }
    } catch (error) {
      console.error('Delete user error:', error)
      throw error
    }
  },
}
