'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usersService } from '@/services/users'
import { authService } from '@/services/auth'

interface UserFormData {
  email: string
  name: string
  password: string
  role: string
}

export default function RegisterUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    password: '',
    role: 'user',
  })
  const [errors, setErrors] = useState<Partial<UserFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login')
      }
    }
    checkSession()
  }, [router])

  const validateForm = () => {
    const newErrors: Partial<UserFormData> = {}

    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      await usersService.createUser(formData)
      alert('Usuario creado exitosamente')
      router.push('/dashboard/users')
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear el usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Registrar Usuario</h1>
          <p className="text-tertiary-content">Crea un nuevo usuario en el sistema</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/users')}
          className="text-tertiary-content hover:text-neutral transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="bg-secondary border-border rounded-lg border p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 transition-colors ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-border focus:border-accent focus:ring-accent'
              } bg-primary text-neutral focus:outline-none focus:ring-2`}
              disabled={isSubmitting}
              placeholder="Ej: Juan Pérez"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-border focus:border-accent focus:ring-accent'
              } bg-primary text-neutral focus:outline-none focus:ring-2`}
              disabled={isSubmitting}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 transition-colors ${
                errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-border focus:border-accent focus:ring-accent'
              } bg-primary text-neutral focus:outline-none focus:ring-2`}
              disabled={isSubmitting}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-neutral">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-primary px-4 py-2 text-neutral focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isSubmitting}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/users')}
              className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2 text-neutral transition-colors hover:bg-primary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-accent px-4 py-2 text-secondary transition-colors hover:bg-accent/80 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
