'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'

// Mock user data - replace with actual auth context
const mockUser = {
  name: 'Jhasmany Fernandez',
  email: 'jhasmany.fernandez.dev@gmail.com',
  role: 'Administrador'
}

// Custom icons
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6"></path>
    <path d="m15.5 3.5l-7 7"></path>
    <path d="m6.5 6.5l7 7"></path>
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
)

const UserMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await authService.logout()
    router.push('/auth/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2 transition-colors duration-200 hover:bg-secondary/80"
      >
        <div className="flex items-center gap-2">
          <UserIcon />
          <span className="text-sm font-medium text-primary-content hidden md:block">
            {mockUser.name}
          </span>
        </div>
        <SettingsIcon />
      </button>

      {isDropdownOpen && (
        <div className="fixed top-16 right-4 w-64 bg-secondary border border-border rounded-lg shadow-lg z-[9999] transform-none">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-accent truncate">{mockUser.role}</p>
            <p className="text-xs text-tertiary-content truncate break-all" title={mockUser.email}>{mockUser.email}</p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                setIsDropdownOpen(false)
                // TODO: Add settings navigation
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-primary-content hover:bg-primary/10 transition-colors duration-200"
            >
              <SettingsIcon />
              Configuración
            </button>

            <button
              onClick={() => {
                setIsDropdownOpen(false)
                handleLogout()
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-accent hover:bg-accent/10 transition-colors duration-200"
            >
              <LogoutIcon />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default UserMenu
