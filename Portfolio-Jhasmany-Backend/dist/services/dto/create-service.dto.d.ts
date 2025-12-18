export declare class CreateServiceDto {
    title: string;
    shortDescription: string;
    icon?: string;
    imageUrl?: string;
    technologies?: string[];
    experienceLevel?: string;
    demoUrl?: string;
    githubUrl?: string;
    clientsServed?: string;
    projectsCompleted?: string;
    ratings?: string;
    showDemoInPortfolio?: boolean;
    showGithubInPortfolio?: boolean;
    showClientsServedInPortfolio?: boolean;
    showProjectsCompletedInPortfolio?: boolean;
    showRatingsInPortfolio?: boolean;
    order?: number;
    isPublished?: boolean;
}
