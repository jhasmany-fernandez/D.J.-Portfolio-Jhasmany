'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import DashboardNavbar from '../Dashboard/DashboardNavbar'
import Navbar from '../Navbar/Navbar'

const NavigationWrapper = () => {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="sticky top-0 z-50 h-16 border-b border-border bg-primary"
        aria-hidden="true"
      />
    )
  }

  const isDashboard = pathname.startsWith('/dashboard')

  return isDashboard ? <DashboardNavbar /> : <Navbar />
}

export default NavigationWrapper
