'use client'

import { useLanguage } from '@/contexts/LanguageContext'

const LanguageIndicator = () => {
  const { currentLanguage } = useLanguage()

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-secondary border border-border rounded-lg px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-xs text-tertiary-content">Lang:</span>
        <span className="text-sm font-medium text-accent">{currentLanguage}</span>
      </div>
    </div>
  )
}

export default LanguageIndicator