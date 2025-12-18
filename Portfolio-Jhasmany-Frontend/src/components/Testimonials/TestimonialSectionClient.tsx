'use client'

import { useEffect, useState } from 'react'
import { Testimonial } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import TestimonialCard from './TestimonialCard'

interface TestimonialSectionClientProps {
  initialTestimonials: Testimonial[]
}

export default function TestimonialSectionClient({ initialTestimonials }: TestimonialSectionClientProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [activeCard, setActiveCard] = useState(0)
  const [subtitle, setSubtitle] = useState<string>(
    "Don't just take our word for it - see what actual users of our service have to say about their experience."
  )

  useEffect(() => {
    // Fetch section subtitle
    const fetchSubtitle = async () => {
      try {
        const response = await fetch('/api/testimonials-section')
        if (response.ok) {
          const data = await response.json()
          setSubtitle(data.subtitle)
        }
      } catch (error) {
        console.error('Error fetching subtitle:', error)
      }
    }

    fetchSubtitle()

    // Poll for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const [testimonialsRes, sectionRes] = await Promise.all([
          fetch('/api/testimonials/published'),
          fetch('/api/testimonials-section')
        ])

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json()
          const freshTestimonials = Array.isArray(data) ? data : (data.testimonials || [])
          setTestimonials(freshTestimonials)
        }

        if (sectionRes.ok) {
          const sectionData = await sectionRes.json()
          setSubtitle(sectionData.subtitle)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="testimonials">
      <SectionHeading
        title="// Testimonials"
        subtitle={subtitle}
      />

      {testimonials.length === 0 ? (
        <div className="my-8 text-center py-12">
          <p className="text-tertiary-content">No testimonials available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="hide-scrollbar my-8 flex gap-8 overflow-x-auto">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={testimonial.id || idx}
                testimonial={testimonial}
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
