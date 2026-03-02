'use client'

import { footerLinks } from '@/appData'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'
import Logo from '../Navbar/Logo'
import { Codepen, Facebook, GithubIcon, Instagram, LinkedIn, X } from '@/utils/icons'

interface FooterData {
  companyName: string
  description: string
  email: string
  phone: string
  locationLine1: string
  locationLine2: string
  githubUrl?: string
  linkedinUrl?: string
  codepenUrl?: string
  twitterUrl?: string
  instagramUrl?: string
  facebookUrl?: string
  availableLanguages?: string[]
}

const normalizeLanguage = (value: string) => {
  const lower = value.toLowerCase()
  if (lower === 'en') return 'En'
  if (lower === 'es') return 'Es'
  if (lower === 'fr') return 'Fr'
  if (lower === 'de') return 'De'
  if (lower === 'ru') return 'Ru'
  return 'En'
}

  const Footer = () => {
  const { currentLanguage, setLanguage } = useLanguage()
  const [footerData, setFooterData] = useState<FooterData>({
    companyName: 'Jhasmany Fernández',
    description: 'Full-Stack Developer specializing in modern web technologies.',
    email: 'jhasmany.fernandez.dev@gmail.com',
    phone: '+591 65856280',
    locationLine1: 'Santa Cruz de la Sierra',
    locationLine2: 'Bolivia',
  })

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/footer', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          // Parse availableLanguages if it's a string (from database)
          const languages = typeof data.availableLanguages === 'string'
            ? data.availableLanguages.split(',').filter((l: string) => l.trim())
            : (Array.isArray(data.availableLanguages) ? data.availableLanguages : ['en', 'es'])

          setFooterData({ ...data, availableLanguages: languages })
        }
      } catch (error) {
        console.error('Error fetching footer data:', error)
      }
    }

    // Fetch on mount
    fetchFooterData()

    // Set up an interval to refetch footer data every 30 seconds
    const intervalId = setInterval(fetchFooterData, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  const hasSocialLinks = Boolean(
    footerData.githubUrl ||
      footerData.linkedinUrl ||
      footerData.codepenUrl ||
      footerData.twitterUrl ||
      footerData.instagramUrl ||
      footerData.facebookUrl,
  )

  return (
    <footer className="bg-secondary relative overflow-hidden px-4 py-10 md:px-12 md:py-12">
      <div className="relative z-20 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <h5 className="mb-4 flex items-center gap-2">
            <Logo width={30} height={24} />
            <span className="text-neutral text-lg font-medium">{footerData.companyName}</span>
          </h5>
          <p className="text-tertiary-content max-w-xl leading-relaxed">
            {footerData.description}
          </p>
          <a
            href="#"
            className="text-neutral mt-3 inline-flex items-center gap-2 text-xs hover:underline">
            More about me <span className="bg-neutral inline-block size-[10px] rounded-full" />
          </a>
        </div>

        <div className="md:col-span-7 flex flex-wrap items-start gap-x-6 gap-y-2 md:justify-end">
          {footerLinks.map((link) => (
            <a
              href={link.href}
              key={link.href}
              className="text-tertiary-content hover:text-neutral text-sm transition-colors duration-300 hover:underline">
              {link.title}.
            </a>
          ))}
        </div>

        <div className="md:col-span-4 grid grid-cols-1 gap-4">
          {hasSocialLinks && (
          <ul className="flex flex-wrap items-center gap-4">
            {footerData.githubUrl && (
              <li className="cursor-pointer bg-transparent">
                <a
                  href={footerData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral transition-color hover:text-neutral/50 h-full w-full duration-300">
                  <GithubIcon />
                </a>
              </li>
            )}
            {footerData.linkedinUrl && (
              <li className="cursor-pointer bg-transparent">
                <a
                  href={footerData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral transition-color hover:text-neutral/50 h-full w-full duration-300">
                  <LinkedIn />
                </a>
              </li>
            )}
            {footerData.codepenUrl && (
              <li className="cursor-pointer bg-transparent">
                <a
                  href={footerData.codepenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral transition-color hover:text-neutral/50 h-full w-full duration-300">
                  <Codepen />
                </a>
              </li>
            )}
            {footerData.twitterUrl && (
              <li className="cursor-pointer bg-transparent">
                <a
                  href={footerData.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral transition-color hover:text-neutral/50 h-full w-full duration-300">
                  <X />
                </a>
              </li>
            )}
            {footerData.instagramUrl && (
              <li className="cursor-pointer bg-transparent">
                <a
                  href={footerData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral transition-color hover:text-neutral/50 h-full w-full duration-300">
                  <Instagram />
                </a>
              </li>
            )}
            {footerData.facebookUrl && (
              <li className="cursor-pointer bg-transparent">
                <a
                  href={footerData.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral transition-color hover:text-neutral/50 h-full w-full duration-300">
                  <Facebook />
                </a>
              </li>
            )}
          </ul>
          )}
          <p className="text-tertiary-content flex flex-col text-xs leading-5">
            <span>© 2025 — Copyright</span>
            <span>All Rights reserved</span>
          </p>
        </div>

        <div className="md:col-span-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="flex flex-col">
              <h5 className="text-neutral mb-2 text-base font-medium">Contact Us</h5>
              <a
                href={`mailto:${footerData.email}`}
                className="text-tertiary-content hover:text-neutral text-sm transition-colors duration-300">
                {footerData.email}
              </a>
              <a
                href={`tel:${footerData.phone}`}
                className="text-tertiary-content hover:text-neutral text-sm transition-colors duration-300">
                {footerData.phone}
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-neutral mb-2 text-base font-medium">Location</h5>
            <address className="text-tertiary-content flex flex-col text-sm not-italic">
              <span>{footerData.locationLine1}</span>
              <span>{footerData.locationLine2}</span>
            </address>
          </div>

          <div>
            <p className="text-neutral mb-2 text-base font-medium">Languages</p>
            <div className="flex flex-wrap gap-4">
              {(footerData.availableLanguages || ['en', 'es']).map((rawLanguage) => {
                const language = normalizeLanguage(rawLanguage)
                return (
                <button
                  key={rawLanguage}
                  onClick={() => setLanguage(language)}
                  className={`cursor-pointer transition-colors duration-300 hover:text-neutral uppercase ${
                    language === currentLanguage
                      ? 'text-neutral font-medium'
                      : 'text-tertiary-content hover:text-neutral/80'
                  }`}
                >
                  {rawLanguage}
                </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral/4 absolute top-1/2 -right-[40%] z-0 h-[120dvw] w-[120dvw] -translate-y-1/2 rounded-full p-10 md:top-0 md:-right-[255px] md:-bottom-[450px] md:size-[1030px] md:-translate-y-0 md:p-16">
        <div className="bg-neutral/4 size-full rounded-full p-10 md:p-16">
          <div className="bg-neutral/5 size-full rounded-full" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
