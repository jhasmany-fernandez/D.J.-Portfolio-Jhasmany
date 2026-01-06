'use client'

import { footerLinks } from '@/appData'
import { socials } from '@/appData/personal'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'
import Logo from '../Navbar/Logo'

interface FooterData {
  companyName: string
  description: string
  email: string
  phone: string
  locationLine1: string
  locationLine2: string
}

const Footer = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage()
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
        const response = await fetch('/api/footer')
        if (response.ok) {
          const data = await response.json()
          setFooterData(data)
        }
      } catch (error) {
        console.error('Error fetching footer data:', error)
      }
    }

    // Fetch only once on mount
    fetchFooterData()
  }, [])
  return (
    <footer className="bg-secondary relative flex min-h-[560px] flex-col justify-between gap-20 overflow-hidden px-4 py-14 md:p-14">
      <div className="relative z-20 grid grid-cols-1 items-start gap-20 md:grid-cols-2 md:gap-12">
        <div>
          <h5 className="mb-8 flex items-center gap-2">
            <Logo width={30} height={24} />
            <span className="text-neutral text-lg font-medium">{footerData.companyName}</span>
          </h5>
          <p className="text-tertiary-content">
            {footerData.description}
          </p>
          <a
            href="#"
            className="text-neutral mt-4 inline-flex items-center gap-2 text-xs hover:underline">
            More about me <span className="bg-neutral inline-block size-[10px] rounded-full" />
          </a>
        </div>

        <div className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <a
              href={link.href}
              key={link.href}
              className="text-tertiary-content hover:text-neutral transition-colors duration-300 hover:underline">
              {link.title}.
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-20 flex flex-col-reverse gap-20 md:grid md:grid-cols-2 md:gap-12">
        <div className="grid grid-cols-2 gap-4">
          <ul className="flex flex-col gap-4">
            {socials.map((item, index) => (
              <li key={index} className="cursor-pointer bg-transparent">
                <a
                  href={item.href}
                  className="text-neutral transition-color hover:text-neutral/50 h-full w-full duration-300">
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-tertiary-content flex flex-col self-end text-right text-xs md:text-center">
            <span>© 2025 — Copyright</span>
            <span>All Rights reserved</span>
          </p>
        </div>

        <div className="flex flex-col justify-between gap-[200px] md:flex-row md:gap-8">
          <div className="space-y-10 md:self-end">
            <div className="flex flex-col">
              <h5 className="text-neutral mb-4 text-lg font-medium">Contact Us</h5>
              <a
                href={`mailto:${footerData.email}`}
                className="text-tertiary-content hover:text-neutral text-sm font-light transition-colors duration-300">
                {footerData.email}
              </a>
              <a
                href={`tel:${footerData.phone}`}
                className="text-tertiary-content hover:text-neutral text-sm font-light transition-colors duration-300">
                {footerData.phone}
              </a>
            </div>
            <div>
              <div>
                <h5 className="text-neutral mb-4 text-lg font-medium">Location</h5>
                <address className="text-tertiary-content flex flex-col text-sm font-light">
                  <span>{footerData.locationLine1}</span>
                  <span>{footerData.locationLine2}</span>
                </address>
              </div>
            </div>
          </div>

          <div className="md:self-end">
            <p className="text-neutral mb-8 text-sm md:text-right">Languages</p>
            <div className="flex gap-8 md:gap-4 lg:gap-8">
              {availableLanguages.map((language) => (
                <button
                  key={language}
                  onClick={() => setLanguage(language)}
                  className={`cursor-pointer transition-colors duration-300 hover:text-neutral ${
                    language === currentLanguage
                      ? 'text-neutral font-medium'
                      : 'text-tertiary-content hover:text-neutral/80'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral/4 absolute top-1/2 -right-[40%] z-0 h-[120dvw] w-[120dvw] -translate-y-1/2 rounded-full p-14 md:top-0 md:-right-[255px] md:-bottom-[450px] md:size-[1030px] md:-translate-y-0 md:p-20">
        <div className="bg-neutral/4 size-full rounded-full p-14 md:p-20">
          <div className="bg-neutral/5 size-full rounded-full" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
