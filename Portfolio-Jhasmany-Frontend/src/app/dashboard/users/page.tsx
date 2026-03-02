'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usersService, type User } from '@/services/users'
import UserModal, { type UserFormData } from '@/components/Dashboard/UserModal'
import { authService } from '@/services/auth'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      loadUsers()
    }
    checkSession()
  }, [router])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await usersService.getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Error al cargar los usuarios. Por favor, verifica tu autenticación.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (data: UserFormData) => {
    try {
      setIsSubmitting(true)
      await usersService.createUser(data)
      await loadUsers()
      alert('Usuario creado exitosamente')
    } catch (err) {
      console.error('Error creating user:', err)
      alert('Error al crear el usuario')
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return
    }

    try {
      await usersService.deleteUser(userId)
      await loadUsers()
      alert('Usuario eliminado exitosamente')
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Error al eliminar el usuario')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">User Management</h1>
          <p className="text-tertiary-content">Administra usuarios y permisos del sistema</p>
        </div>
        <div className="bg-secondary border-border rounded-lg border p-12 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-tertiary-content">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">User Management</h1>
          <p className="text-tertiary-content">Administra usuarios y permisos del sistema</p>
        </div>
        <div className="bg-secondary border-border rounded-lg border p-12 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={loadUsers}
              className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Reintentar
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Ir a Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
        loading={isSubmitting}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral mb-2">User Management</h1>
            <p className="text-tertiary-content">Administra usuarios y permisos del sistema</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
          >
            + Agregar Usuario
          </button>
        </div>

      <div className="bg-secondary border-border rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/10 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral">Fecha de Creación</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-tertiary-content">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-neutral">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-tertiary-content">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-tertiary-content">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          onClick={() => alert('Editar funcionalidad próximamente')}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

        {users.length > 0 && (
          <div className="text-sm text-tertiary-content">
            Total de usuarios: {users.length}
          </div>
        )}
      </div>
    </>
  )
}
