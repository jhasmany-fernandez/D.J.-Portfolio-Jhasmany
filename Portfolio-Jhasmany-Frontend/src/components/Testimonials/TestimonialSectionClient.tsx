'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { pickLocalizedText } from '@/utils/i18n'
import { Testimonial } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import TestimonialCard from './TestimonialCard'

interface TestimonialSectionClientProps {
  initialTestimonials: Testimonial[]
}

export default function TestimonialSectionClient({ initialTestimonials }: TestimonialSectionClientProps) {
  const { currentLanguage, t } = useLanguage()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [activeCard, setActiveCard] = useState(0)
  const [subtitle, setSubtitle] = useState<string>(
    "Don't just take our word for it - see what actual users of our service have to say about their experience."
  )
  const [subtitleEs, setSubtitleEs] = useState<string>('')

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [testimonialsRes, sectionRes] = await Promise.all([
          fetch('/api/testimonials/published'),
          fetch('/api/testimonials-section')
        ])

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json()
          const freshTestimonials = Array.isArray(data) ? data : (data.testimonials || [])
          if (isMounted) {
            setTestimonials(freshTestimonials)
          }
        }

        if (sectionRes.ok) {
          const sectionData = await sectionRes.json()
          if (isMounted) {
            setSubtitle(sectionData.subtitle)
            setSubtitleEs(sectionData.subtitleEs || '')
          }
        }
      } catch (error) {
        // Keep server-rendered testimonials if the client request is interrupted.
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="testimonials">
      <SectionHeading
        title={t('section.testimonials')}
        subtitle={currentLanguage === 'Es' && subtitleEs ? subtitleEs : subtitle}
      />

      {testimonials.length === 0 ? (
        <div className="my-8 text-center py-12">
          <p className="text-tertiary-content">{t('empty.testimonials')}</p>
        </div>
      ) : (
        <>
          <div className="hide-scrollbar my-8 flex gap-8 overflow-x-auto">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={testimonial.id || idx}
                testimonial={{
                  ...testimonial,
                  title: pickLocalizedText(testimonial, 'title', currentLanguage),
                  feedback: pickLocalizedText(testimonial, 'feedback', currentLanguage),
                }}
                handleActiveCard={() => {
                  setActiveCard(idx)
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-1 sm:hidden">
            {testimonials.map((_, idx) => (
              <div
                key={idx}
                className={`${idx === activeCard ? 'bg-accent size-[12px]' : 'size-[10px] bg-white/50'} rounded-full`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
