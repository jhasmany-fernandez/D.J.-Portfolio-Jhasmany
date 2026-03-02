'use client'

import Link from 'next/link'
import Logo from '../Navbar/Logo'
import UserMenu from './UserMenu'

const DashboardNavbar = () => {
  return (
    <nav className="bg-primary border-border fixed top-0 right-0 left-0 z-50 h-16 overflow-hidden border-b">
      <div className="flex h-full w-full items-center justify-between px-2 py-1 sm:px-3 lg:px-4">
        <Link href="/dashboard">
          <div className="animate-fade-up text-primary-content relative flex items-center gap-3 transition-all duration-300">
            <Logo />
            <span className="text-primary-content">Dashboard</span>
          </div>
        </Link>

        <UserMenu />
      </div>
    </nav>
  )
}

export default DashboardNavbar
