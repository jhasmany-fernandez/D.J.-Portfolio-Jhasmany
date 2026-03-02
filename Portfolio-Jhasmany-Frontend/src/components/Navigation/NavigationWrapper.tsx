'use client'

import { usePathname } from 'next/navigation'
import DashboardNavbar from '../Dashboard/DashboardNavbar'
import Navbar from '../Navbar/Navbar'

const NavigationWrapper = () => {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return isDashboard ? <DashboardNavbar /> : <Navbar />
}

export default NavigationWrapper