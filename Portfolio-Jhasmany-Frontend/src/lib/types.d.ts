export interface Project {
  id?: string // Optional for API responses
  title: string
  description?: string
  shortDescription: string
  content?: string
  technologies?: string[]
  priority: number
  imageUrl?: string
  cover: string
  demoUrl?: string
  livePreview?: string
  showLivePreviewInPortfolio?: boolean // Toggle to show/hide Live Preview in public portfolio
  githubUrl?: string
  githubLink?: string
  showGithubInPortfolio?: boolean // Toggle to show/hide GitHub link in public portfolio
  visitors?: string
  showVisitorsInPortfolio?: boolean // Toggle to show/hide visitors in public portfolio
  earned?: string
  showEarnedInPortfolio?: boolean // Toggle to show/hide earnings in public portfolio
  githubStars?: string
  showGithubStarsInPortfolio?: boolean // Toggle to show/hide GitHub stars in public portfolio
  ratings?: string
  showRatingsInPortfolio?: boolean // Toggle to show/hide ratings in public portfolio
  numberOfSales?: string
  showNumberOfSalesInPortfolio?: boolean // Toggle to show/hide sales in public portfolio
  type: string
  siteAge?: string
  showSiteAgeInPortfolio?: boolean // Toggle to show/hide site age in public portfolio
  order?: number
  isPublished?: boolean
  authorId?: string
  author?: unknown
  createdAt?: string
  updatedAt?: string
}

export interface Heading {
  id: string
  title: string
  items: Heading[]
}

export interface Testimonial {
  id?: string
  name: string
  title?: string
  feedback: string
  image: string
  stars: number
  isPublished?: boolean
  createdAt: string
  updatedAt?: string
}
