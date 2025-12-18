import type { Metadata } from 'next'
import './globals.css'

import Footer from '@/components/Footer/Footer'
import LanguageIndicator from '@/components/LanguageIndicator/LanguageIndicator'
import NavigationWrapper from '@/components/Navigation/NavigationWrapper'
import ThemeMenu from '@/components/Theme/ThemeMenu'
import { LanguageProvider } from '@/contexts/LanguageContext'
// import { Fira_Code } from 'next/font/google'

// const firaCode = Fira_Code({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

const title = 'Jhasmany Fernandez | Full-Stack Web Developer in Chicago'

const description =
  "Skilled full-stack web developer in Chicago. I build responsive, user-friendly websites with React, NextJS, and NodeJS. Let's bring your vision to life. Hire me today!"

const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title,
  description,
  category: 'technology',
  metadataBase: new URL(url),
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: 'Jhasmany Fernandez Portfolio',
    type: 'website',
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@Basit_Miyanji',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <header>
            <NavigationWrapper />
          </header>
          {children}
          <ThemeMenu />
          <LanguageIndicator />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
