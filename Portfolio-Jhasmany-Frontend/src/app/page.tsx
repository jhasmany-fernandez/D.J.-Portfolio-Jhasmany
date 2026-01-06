import HeroClient from '@/components/Hero/HeroClient'
import ProjectSectionClient from '@/components/Projects/ProjectSectionClient'
import ServiceSectionClient from '@/components/Services/ServiceSectionClient'
import SkillsClient from '@/components/Skills/SkillsClient'
import TestimonialSectionClient from '@/components/Testimonials/TestimonialSectionClient'
import { getAllProjects, getAllServices, getAllSkills, getAllTestimonials } from '@/services'

// Disable caching for this page to show real-time updates
export const revalidate = 0

async function getActiveHomeSection() {
  try {
    const apiUrl = process.env.API_URL || 'http://backend:3001'
    const response = await fetch(`${apiUrl}/api/home/active`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const text = await response.text()
    if (!text) {
      return null
    }

    try {
      const data = JSON.parse(text)
      // If backend returns {homeSection: null}, return null
      if (data && data.homeSection === null) {
        return null
      }
      return data
    } catch (parseError) {
      console.error('Error parsing home section JSON:', parseError)
      return null
    }
  } catch (error) {
    console.error('Error fetching active home section:', error)
    return null
  }
}

export default async function Home() {
  const projects = await getAllProjects()
  const services = await getAllServices()
  const skills = await getAllSkills()
  const testimonials = await getAllTestimonials()
  const homeSection = await getActiveHomeSection()

  return (
    <main>
      <HeroClient initialHomeSection={homeSection} />
      <SkillsClient initialSkills={skills} />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <ProjectSectionClient initialProjects={projects} />
        <ServiceSectionClient initialServices={services} />
        <TestimonialSectionClient initialTestimonials={testimonials} />
      </div>
    </main>
  )
}
