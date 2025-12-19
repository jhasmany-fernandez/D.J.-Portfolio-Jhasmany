'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BurgerIcon, CloseIcon } from '../../utils/icons'
import Logo from './Logo'

const navItems = [
  {
    label: '_home',
    href: '/',
  },
  {
    label: '_projects',
    href: '/#projects',
  },
  {
    label: '_services',
    href: '/#services',
  },
  {
    label: '_testimonials',
    href: '/#testimonials',
  },
  {
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
    <nav className="sticky top-0 z-50 bg-primary border-border h-16 overflow-hidden border-b">
      <div className="mx-auto flex h-full w-dvw max-w-[1200px] items-center justify-between px-4 py-1">
        {isVisible ? (
          <div className="text-primary-content md:hidden">_menu</div>
        ) : (
          <Link href="/">
            <div className="animate-fade-up text-primary-content relative flex items-center gap-3 transition-all duration-300 md:static">
              <Logo />
              <span className="text-primary-content">{getDisplayName()}</span>
            </div>
          </Link>
        )}

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
          <ul
            className={`${isVisible ? 'flex' : 'hidden'} animate-fade-in bg-primary absolute top-16 left-0 z-10 h-dvh w-dvw flex-col md:static md:top-0 md:flex md:h-full md:w-[72%] md:flex-row lg:w-[70%]`}>
            {navItems.map(({ label, href }) => (
              <li
                key={href}
                onClick={() => setIsVisible(false)}
                className="border-border flex items-center border-b px-4 text-2xl md:border-y-0 md:border-e md:text-base md:first:border-s md:last:ml-auto md:last:border-none md:last:px-0 lg:px-8">
                <Link
                  href={href}
                  className={`text-primary-content hover:text-neutral w-full py-7 transition-all duration-150 md:py-0 ${pathname === href ? 'text-neutral cursor-text' : ''}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}

export default Navbar
