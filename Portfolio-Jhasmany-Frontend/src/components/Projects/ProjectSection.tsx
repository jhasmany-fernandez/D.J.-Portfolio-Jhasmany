import { Project } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import ProjectCard from './ProjectCard'

interface ProjectSectionProps {
  projects: Project[]
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  return (
    <section id="projects">
      <SectionHeading title="// Projects" />

      <div className="my-8 grid grid-cols-1 gap-8 md:my-12 xl:grid-cols-2 xl:gap-10 2xl:gap-12">
        {projects.map((project, index) => (
          <ProjectCard key={project.id || `project-${index}`} data={project} />
        ))}
      </div>
    </section>
  )
}

export default ProjectSection
