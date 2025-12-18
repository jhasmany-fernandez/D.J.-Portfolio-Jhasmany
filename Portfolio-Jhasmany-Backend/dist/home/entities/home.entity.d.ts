import { User } from '../../users/entities/user.entity';
export declare class HomeSection {
    id: string;
    greeting: string;
    roles: string[];
    description: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    authorId: string;
}
