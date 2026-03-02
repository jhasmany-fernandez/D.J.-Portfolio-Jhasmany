'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BurgerIcon, CloseIcon } from '../../utils/icons'
import Logo from './Logo'

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

const ProjectsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
)

const ServicesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6M1 12h6m6 0h6"></path>
    <path d="m4.93 4.93 4.24 4.24m5.66 0 4.24-4.24m0 14.14-4.24-4.24m-5.66 0-4.24 4.24"></path>
  </svg>
)

const TestimonialsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
)

const LoginIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
)

const navItems = [
  {
    icon: HomeIcon,
    label: '_home',
    href: '/',
  },
  {
    icon: ProjectsIcon,
    label: '_projects',
    href: '/#projects',
  },
  {
    icon: ServicesIcon,
    label: '_services',
    href: '/#services',
  },
  {
    icon: TestimonialsIcon,
    label: '_testimonials',
    href: '/#testimonials',
  },
  {
    icon: LoginIcon,
    label: '_login',
    href: '/auth/login',
  },
]

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const shouldHideNavItems = pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/newsletter/subscribe'

  // Function to get the display name based on the current route
  const getDisplayName = () => {
    switch (pathname) {
      case '/auth/login':
        return 'login'
      case '/auth/register':
        return 'register'
      case '/newsletter/subscribe':
        return 'subscribe'
      default:
        return 'Jhasmany_Fernandez'
    }
  }

  const toggleMenu = () => {
    setIsVisible(!isVisible)
  }

  return (
    <nav className="sticky top-0 z-50 bg-primary border-border h-16 overflow-visible border-b">
      <div className="mx-auto flex h-full w-dvw max-w-[1200px] items-center justify-between px-4 py-1">
        <Link href="/">
          <div className="animate-fade-up text-primary-content relative flex items-center gap-3 transition-all duration-300 md:static">
            <Logo />
            <span className="text-primary-content">{getDisplayName()}</span>
          </div>
        </Link>

        {!shouldHideNavItems && (
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isVisible ? (
                <CloseIcon className="text-primary-content" />
              ) : (
                <BurgerIcon className="text-primary-content" />
              )}
            </button>
          </div>
        )}

        {!shouldHideNavItems && (
          <>
            <ul
              className={`${isVisible ? 'flex' : 'hidden'} animate-fade-in bg-primary border-border absolute top-16 left-2 z-20 max-h-[70vh] w-[86vw] max-w-xs flex-col overflow-y-auto rounded-xl border shadow-xl md:hidden`}>
              {navItems.map(({ icon: Icon, label, href }) => (
                <li
                  key={`mobile-${href}`}
                  onClick={() => setIsVisible(false)}
                  className="border-border flex items-center border-b px-4 text-base last:border-b-0">
                  <Link
                    href={href}
                    className={`text-primary-content hover:text-neutral flex w-full items-center gap-3 py-4 transition-all duration-150 ${pathname === href ? 'text-neutral cursor-text' : ''}`}>
                    <span aria-hidden="true" className="text-accent leading-none">
                      <Icon />
                    </span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="hidden h-full w-[72%] md:flex md:flex-row lg:w-[70%]">
              {navItems.map(({ label, href }) => (
                <li
                  key={`desktop-${href}`}
                  className="border-border flex items-center border-e px-4 text-base first:border-s last:ml-auto last:border-none last:px-0 lg:px-8">
                  <Link
                    href={href}
                    className={`text-primary-content hover:text-neutral w-full py-0 transition-all duration-150 ${pathname === href ? 'text-neutral cursor-text' : ''}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
