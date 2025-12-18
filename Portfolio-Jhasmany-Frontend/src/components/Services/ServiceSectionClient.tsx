'use client'

import { useEffect, useState } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import ServiceCard from './ServiceCard'

interface Service {
  id: string
  title: string
  shortDescription: string
  icon: string
  imageUrl?: string
  technologies?: string[]
  experienceLevel?: string
  demoUrl?: string
  githubUrl?: string
  clientsServed?: string
  projectsCompleted?: string
  ratings?: string
  showDemoInPortfolio?: boolean
  showGithubInPortfolio?: boolean
  showClientsServedInPortfolio?: boolean
  showProjectsCompletedInPortfolio?: boolean
  showRatingsInPortfolio?: boolean
  isPublished: boolean
}

interface ServiceSectionClientProps {
  initialServices: Service[]
}

export default function ServiceSectionClient({ initialServices }: ServiceSectionClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [subtitle, setSubtitle] = useState<string>(
    'I offer a wide range of services to ensure you have the best written code and stay ahead in the competition.'
  )

  useEffect(() => {
    // Fetch section subtitle
    const fetchSubtitle = async () => {
      try {
        const response = await fetch('/api/services-section')
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
        const [servicesRes, sectionRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/services-section')
        ])

        if (servicesRes.ok) {
          const data = await servicesRes.json()
          const freshServices = Array.isArray(data) ? data : (data.services || [])
          const publishedServices = freshServices.filter((service: Service) => service.isPublished)
          setServices(publishedServices)
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
    <section id="services" className="my-14">
      <SectionHeading
        title="// Services / Offers:"
        subtitle={subtitle}
      />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {services.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-tertiary-content">No services available at the moment.</p>
          </div>
        ) : (
          services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              shortDescription={service.shortDescription}
              imageUrl={service.imageUrl}
              technologies={service.technologies}
              experienceLevel={service.experienceLevel}
              demoUrl={service.demoUrl}
              githubUrl={service.githubUrl}
              clientsServed={service.clientsServed}
              projectsCompleted={service.projectsCompleted}
              ratings={service.ratings}
              showDemoInPortfolio={service.showDemoInPortfolio}
              showGithubInPortfolio={service.showGithubInPortfolio}
              showClientsServedInPortfolio={service.showClientsServedInPortfolio}
              showProjectsCompletedInPortfolio={service.showProjectsCompletedInPortfolio}
              showRatingsInPortfolio={service.showRatingsInPortfolio}
            />
          ))
        )}
      </div>
    </section>
  )
}
