import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { LoginAttempt } from './entities/login-attempt.entity';
import { EmailService } from '../common/services/email.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    private passwordResetTokenRepository;
    private loginAttemptRepository;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, passwordResetTokenRepository: Repository<PasswordResetToken>, loginAttemptRepository: Repository<LoginAttempt>);
    validateUser(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<any>;
    login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<{
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
    getProfile(userId: string): Promise<import("../users/entities/user.entity").User>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto, ipAddress?: string, userAgent?: string): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, ipAddress?: string): Promise<{
        message: string;
    }>;
    validateResetToken(token: string): Promise<{
        valid: boolean;
        message: string;
    }>;
    recordLoginAttempt(email: string, ipAddress?: string, userAgent?: string, successful?: boolean, failureReason?: string, userId?: string): Promise<void>;
    getRecentFailedAttempts(email: string, ipAddress?: string): Promise<number>;
    isAccountLocked(email: string, ipAddress?: string): Promise<boolean>;
    lockAccount(email: string, ipAddress?: string): Promise<void>;
    resetFailedAttempts(email: string, ipAddress?: string): Promise<void>;
    unlockAccount(email: string): Promise<void>;
}
