'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const TESTIMONIAL_DASHBOARD_PATH = '/dashboard/testimonials'

interface DashboardRoleGateProps {
  children: ReactNode
}

export default function DashboardRoleGate({ children }: DashboardRoleGateProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  const isTestimonialOutsideAllowedArea =
    user?.role === 'testimonial' && !pathname.startsWith(TESTIMONIAL_DASHBOARD_PATH)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/auth/login')
      return
    }

    if (isTestimonialOutsideAllowedArea) {
      router.replace(TESTIMONIAL_DASHBOARD_PATH)
    }
  }, [isTestimonialOutsideAllowedArea, loading, router, user])

  if (loading || !user || isTestimonialOutsideAllowedArea) {
    return (
      <div className="min-h-screen bg-primary pt-16">
        <div className="p-6 text-sm text-tertiary-content">Validando acceso...</div>
      </div>
    )
  }

  return <>{children}</>
}
