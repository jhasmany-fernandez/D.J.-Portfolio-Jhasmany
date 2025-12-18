import SectionHeading from '../SectionHeading/SectionHeading'
import ServiceCard from './ServiceCard'

// Get backend URL for SSR
const getBackendURL = () => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3001'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

// Fetch services from API
async function fetchServices() {
  try {
    const backendURL = getBackendURL()
    const response = await fetch(`${backendURL}/api/services`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      console.error('Failed to fetch services:', response.status)
      return []
    }

    const data = await response.json()
    console.log('Services data received:', data)

    // Backend returns array directly, not wrapped in object
    const services = Array.isArray(data) ? data : (data.services || [])

    // Filter only published services
    return services.filter((service: any) => service.isPublished)
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

const ServiceSection = async () => {
  const services = await fetchServices()

  return (
    <section id="services" className="my-14">
      <SectionHeading
        title="// Services / Offers:"
        subtitle="I offer a wide range of services to ensure you have the best written code and stay ahead in the competition."
      />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {services.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-tertiary-content">No services available at the moment.</p>
          </div>
        ) : (
          services.map((service: any) => (
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

export default ServiceSection
