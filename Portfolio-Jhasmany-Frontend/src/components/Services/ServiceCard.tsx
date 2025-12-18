'use client'

interface ServiceCardTypes {
  icon: string
  title: string
  shortDescription: string
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
}

const ServiceCard: React.FC<ServiceCardTypes> = ({
  title,
  shortDescription,
  icon,
  imageUrl,
  technologies = [],
  experienceLevel,
  demoUrl,
  githubUrl,
  clientsServed,
  projectsCompleted,
  ratings,
  showDemoInPortfolio = true,
  showGithubInPortfolio = true,
  showClientsServedInPortfolio = true,
  showProjectsCompletedInPortfolio = true,
  showRatingsInPortfolio = true
}) => {
  return (
    <div className="group bg-secondary border-border hover:border-accent relative flex flex-col items-center rounded-[14px] border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10">
      {/* Experience Badge */}
      {experienceLevel && (
        <div className="absolute top-4 right-4">
          <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-semibold border border-accent/20">
            {experienceLevel}
          </span>
        </div>
      )}

      {/* Icon/Image */}
      <div className="flex flex-col items-center gap-3 mb-4">
        {icon && (
          <div className="text-5xl" role="img" aria-label={title}>
            {icon}
          </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-32 h-20 object-cover rounded-lg border-2 border-accent/30 shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        )}
      </div>

      {/* Title */}
      <h5 className="text-accent text-lg font-bold mb-3 text-center group-hover:text-accent/90 transition-colors">
        {title}
      </h5>

      {/* Description */}
      <p className="text-tertiary-content text-sm mb-4 flex-grow leading-relaxed text-center">
        {shortDescription}
      </p>

      {/* Technologies */}
      {technologies && technologies.length > 0 && (
        <div className="mt-auto pt-4 border-t border-border/50 w-full">
          <div className="flex flex-wrap gap-2 justify-center">
            {technologies.slice(0, 5).map((tech, index) => (
              <span
                key={index}
                className="bg-primary text-primary-content px-2.5 py-1 rounded-md text-xs font-medium border border-border/30 hover:border-accent/50 transition-colors"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 5 && (
              <span className="text-tertiary-content text-xs px-2 py-1 flex items-center">
                +{technologies.length - 5} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      {(showClientsServedInPortfolio && clientsServed) || (showProjectsCompletedInPortfolio && projectsCompleted) || (showRatingsInPortfolio && ratings) ? (
        <div className="pt-3 border-t border-border/50 mt-3 w-full">
          <div className="flex flex-wrap gap-3 justify-center">
            {showClientsServedInPortfolio && clientsServed && (
              <div className="flex items-center gap-1.5 text-xs text-tertiary-content">
                <span>👥</span>
                <span className="font-medium">{clientsServed}</span>
              </div>
            )}
            {showProjectsCompletedInPortfolio && projectsCompleted && (
              <div className="flex items-center gap-1.5 text-xs text-tertiary-content">
                <span>📁</span>
                <span className="font-medium">{projectsCompleted}</span>
              </div>
            )}
            {showRatingsInPortfolio && ratings && (
              <div className="flex items-center gap-1.5 text-xs text-tertiary-content">
                <span>⭐</span>
                <span className="font-medium">{ratings}</span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* URLs */}
      {(showDemoInPortfolio && demoUrl) || (showGithubInPortfolio && githubUrl) ? (
        <div className="pt-3 border-t border-border/50 mt-3 w-full">
          <div className="flex flex-wrap gap-2 justify-center">
            {showDemoInPortfolio && demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-md text-xs font-medium border border-accent/30 hover:border-accent/50 transition-all"
              >
                <span>🔗</span>
                <span>Demo</span>
              </a>
            )}
            {showGithubInPortfolio && githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-accent/10 text-primary-content hover:text-accent rounded-md text-xs font-medium border border-border/30 hover:border-accent/50 transition-all"
              >
                <span>💻</span>
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ServiceCard
