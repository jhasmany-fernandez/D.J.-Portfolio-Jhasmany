import { Project } from '../../projects/entities/project.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { HomeSection } from '../../home/entities/home.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    projects: Project[];
    skills: Skill[];
    homeSections: HomeSection[];
}
