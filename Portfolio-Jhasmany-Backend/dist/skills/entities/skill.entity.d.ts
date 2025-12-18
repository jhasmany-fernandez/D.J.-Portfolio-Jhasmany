import { User } from '../../users/entities/user.entity';
export declare class Skill {
    id: string;
    name: string;
    icon: string;
    imageUrl: string;
    order: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    authorId: string;
}
