'use client'

import { useEffect, useState } from 'react'

export default function DebugThemePage() {
  const [theme, setTheme] = useState('dark')
  const [cssVars, setCssVars] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedTheme = document.cookie
      .split('; ')
      .find((row) => row.startsWith('theme='))
      ?.split('=')[1] ?? 'dark'
    setTheme(savedTheme)

    const updateCSSVars = () => {
      const style = getComputedStyle(document.documentElement)
      const vars = ['--p', '--pc', '--s', '--sc', '--tc', '--a', '--n', '--b', '--color-primary', '--color-primary-content']
      const varValues: Record<string, string> = {}
      vars.forEach(v => {
        varValues[v] = style.getPropertyValue(v).trim()
      })
      setCssVars(varValues)
    }

    updateCSSVars()

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme')
      if (currentTheme && currentTheme !== theme) {
        setTheme(currentTheme)
        setTimeout(updateCSSVars, 100) // Small delay to ensure CSS has updated
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [theme])

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-secondary border border-border rounded-lg p-6">
          <h1 className="text-neutral text-2xl font-semibold mb-6">
            Theme Debug - Current: {theme}
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-secondary-content text-lg mb-4">CSS Variables:</h2>
              <div className="bg-neutral/10 p-4 rounded text-sm font-mono space-y-1">
                {Object.entries(cssVars).map(([key, value]) => (
                  <div key={key} className="text-tertiary-content">
                    <span className="text-accent">{key}:</span> {value || 'undefined'}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-secondary-content text-lg mb-4">Input Tests:</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-content mb-1">
                    Standard Input with bg-primary
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Should match theme primary color"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                  <small className="text-xs text-tertiary-content mt-1 block">
                    Expected bg: {cssVars['--color-primary'] || cssVars['--p']}
                  </small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-content mb-1">
                    Input with inline style override
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Force styled background"
                    style={{
                      backgroundColor: `var(--color-primary, ${cssVars['--p']})`,
                      color: `var(--color-primary-content, ${cssVars['--pc']})`
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-content mb-1">
                    Input with computed style
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border border-border rounded-md placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Manual computed background"
                    style={{
                      backgroundColor: cssVars['--p'] || '#ffffff',
                      color: cssVars['--pc'] || '#000000'
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-secondary-content text-lg mb-4">Color Swatches:</h2>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-primary p-4 rounded text-center">
                  <div className="text-primary-content text-xs">Primary</div>
                  <div className="text-primary-content text-xs font-mono">{cssVars['--p']}</div>
                </div>
                <div className="bg-secondary p-4 rounded text-center">
                  <div className="text-secondary-content text-xs">Secondary</div>
                  <div className="text-secondary-content text-xs font-mono">{cssVars['--s']}</div>
                </div>
                <div className="bg-accent p-4 rounded text-center">
                  <div className="text-secondary text-xs">Accent</div>
                  <div className="text-secondary text-xs font-mono">{cssVars['--a']}</div>
                </div>
                <div className="bg-neutral p-4 rounded text-center">
                  <div className="text-primary text-xs">Neutral</div>
                  <div className="text-primary text-xs font-mono">{cssVars['--n']}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-tertiary-content text-sm">
              Use the theme selector in the bottom right to test different themes.
              <br />
              Watch how the input backgrounds and CSS variables change.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
