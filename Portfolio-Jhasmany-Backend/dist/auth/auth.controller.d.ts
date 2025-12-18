import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, ipAddress: string, userAgent: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        projects: import("../projects/entities/project.entity").Project[];
        skills: import("../skills/entities/skill.entity").Skill[];
        homeSections: import("../home/entities/home.entity").HomeSection[];
    }>;
    getProfile(req: any): Promise<import("../users/entities/user.entity").User>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto, ipAddress: string, userAgent: string): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, ipAddress: string): Promise<{
        message: string;
    }>;
    validateResetToken(token: string): Promise<{
        valid: boolean;
        message: string;
    }>;
}
