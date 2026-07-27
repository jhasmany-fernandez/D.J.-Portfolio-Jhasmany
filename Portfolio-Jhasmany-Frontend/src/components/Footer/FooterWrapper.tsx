'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

const FooterWrapper = () => {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || pathname.startsWith('/dashboard')) {
    return null
  }

  return <Footer />
}

export default FooterWrapper
