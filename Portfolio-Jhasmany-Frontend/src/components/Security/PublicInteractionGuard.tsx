'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const PublicInteractionGuard = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/dashboard')) return

    const blockContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    const blockDevToolsShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const isCtrlOrMeta = event.ctrlKey || event.metaKey
      const isDevToolsCombo =
        event.key === 'F12' ||
        (isCtrlOrMeta && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (isCtrlOrMeta && key === 'u')

      if (isDevToolsCombo) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener('contextmenu', blockContextMenu)
    document.addEventListener('keydown', blockDevToolsShortcuts)

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu)
      document.removeEventListener('keydown', blockDevToolsShortcuts)
    }
  }, [pathname])

  return null
}

export default PublicInteractionGuard
