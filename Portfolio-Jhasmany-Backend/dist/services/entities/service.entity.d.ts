import { User } from '../../users/entities/user.entity';
export declare class Service {
    id: string;
    title: string;
    shortDescription: string;
    icon: string;
    imageUrl: string;
    technologies: string[];
    experienceLevel: string;
    demoUrl: string;
    githubUrl: string;
    clientsServed: string;
    projectsCompleted: string;
    ratings: string;
    showDemoInPortfolio: boolean;
    showGithubInPortfolio: boolean;
    showClientsServedInPortfolio: boolean;
    showProjectsCompletedInPortfolio: boolean;
    showRatingsInPortfolio: boolean;
    order: number;
    isPublished: boolean;
    authorId: string;
    author: User;
    createdAt: Date;
    updatedAt: Date;
}
