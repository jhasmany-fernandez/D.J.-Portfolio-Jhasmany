import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, MoreThanOrEqual } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { LoginAttempt } from './entities/login-attempt.entity';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(LoginAttempt)
    private loginAttemptRepository: Repository<LoginAttempt>,
  ) {}

  async validateUser(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<any> {
    // Check if account is locked
    const isLocked = await this.isAccountLocked(email, ipAddress);
    if (isLocked) {
      await this.recordLoginAttempt(email, ipAddress, userAgent, false, 'Account locked');
      throw new UnauthorizedException('Account is temporarily locked due to multiple failed login attempts. Try again later.');
    }

    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Reset failed attempts on successful login
      await this.resetFailedAttempts(email, ipAddress);
      await this.recordLoginAttempt(email, ipAddress, userAgent, true, null, user.id);

      const { password, ...result } = user;
      return result;
    }

    // Record failed attempt
    await this.recordLoginAttempt(email, ipAddress, userAgent, false, 'Invalid credentials');

    // Check if account should be locked after this failed attempt
    const failedAttempts = await this.getRecentFailedAttempts(email, ipAddress);
    if (failedAttempts >= 3) {
      await this.lockAccount(email, ipAddress);
      throw new UnauthorizedException('Account locked due to multiple failed login attempts. Try again in 15 minutes.');
    }

    return null;
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password, ipAddress, userAgent);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Additional security check before login
    const isLocked = await this.isAccountLocked(user.email, ipAddress);
    if (isLocked) {
      throw new UnauthorizedException('Account is temporarily locked. Try again later.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  async getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto, ipAddress?: string, userAgent?: string) {
    const { email } = forgotPasswordDto;

    // Buscar usuario por email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    // Invalidar tokens existentes del usuario
    await this.passwordResetTokenRepository.update(
      { userId: user.id, isUsed: false },
      { isUsed: true }
    );

    // Generar token seguro
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Crear nuevo token con expiración de 1 hora
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const passwordResetToken = this.passwordResetTokenRepository.create({
      token: resetToken,
      userId: user.id,
      expiresAt,
      ipAddress,
      userAgent,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // Enviar email de reseteo
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (error) {
      // Log error pero no fallar la operación
      console.error('Failed to send password reset email:', error);
    }

    return { message: 'If the email exists, a password reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, ipAddress?: string) {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Buscar token válido
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        token,
        isUsed: false
      },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Verificar expiración
    if (new Date() > resetToken.expiresAt) {
      throw new BadRequestException('Reset token has expired');
    }

    // Verificar que el usuario existe y está activo
    if (!resetToken.user || !resetToken.user.isActive) {
      throw new BadRequestException('User account is not active');
    }

    // Verificar que la nueva contraseña no sea igual a la actual
    const isSamePassword = await bcrypt.compare(newPassword, resetToken.user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    try {
      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Actualizar contraseña del usuario
      await this.usersService.updatePassword(resetToken.user.id, hashedPassword);

      // Marcar token como usado
      await this.passwordResetTokenRepository.update(
        { id: resetToken.id },
        { isUsed: true }
      );

      // Invalidar todos los demás tokens del usuario
      await this.passwordResetTokenRepository.update(
        { userId: resetToken.user.id, isUsed: false },
        { isUsed: true }
      );

      // Enviar email de confirmación
      try {
        await this.emailService.sendPasswordResetConfirmation(
          resetToken.user.email,
          resetToken.user.name
        );
      } catch (error) {
        console.error('Failed to send password reset confirmation email:', error);
      }

      return { message: 'Password has been reset successfully' };

    } catch (error) {
      throw new BadRequestException('Failed to reset password. Please try again.');
    }
  }

  async validateResetToken(token: string) {
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        token,
        isUsed: false
      },
    });

    if (!resetToken) {
      return { valid: false, message: 'Invalid reset token' };
    }

    if (new Date() > resetToken.expiresAt) {
      return { valid: false, message: 'Reset token has expired' };
    }

    return { valid: true, message: 'Token is valid' };
  }

  // Login Attempt Security Methods
  async recordLoginAttempt(
    email: string,
    ipAddress?: string,
    userAgent?: string,
    successful = false,
    failureReason?: string,
    userId?: string,
  ): Promise<void> {
    const loginAttempt = this.loginAttemptRepository.create({
      email,
      ipAddress,
      userAgent,
      successful,
      failureReason,
      userId,
    });

    await this.loginAttemptRepository.save(loginAttempt);
  }

  async getRecentFailedAttempts(email: string, ipAddress?: string): Promise<number> {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const whereClause: any = {
      email,
      successful: false,
      createdAt: MoreThanOrEqual(fifteenMinutesAgo),
    };

    if (ipAddress) {
      whereClause.ipAddress = ipAddress;
    }

    const count = await this.loginAttemptRepository.count({
      where: whereClause,
    });

    return count;
  }

  async isAccountLocked(email: string, ipAddress?: string): Promise<boolean> {
    const now = new Date();

    const whereClause: any = {
      email,
      lockedUntil: MoreThan(now),
    };

    if (ipAddress) {
      whereClause.ipAddress = ipAddress;
    }

    const lockedAttempt = await this.loginAttemptRepository.findOne({
      where: whereClause,
    });

    return !!lockedAttempt;
  }

  async lockAccount(email: string, ipAddress?: string): Promise<void> {
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + 15); // Lock for 15 minutes

    const loginAttempt = this.loginAttemptRepository.create({
      email,
      ipAddress,
      successful: false,
      failureReason: 'Account locked due to multiple failed attempts',
      lockedUntil: lockUntil,
    });

    await this.loginAttemptRepository.save(loginAttempt);
  }

  async resetFailedAttempts(email: string, ipAddress?: string): Promise<void> {
    const whereClause: any = {
      email,
      successful: false,
    };

    if (ipAddress) {
      whereClause.ipAddress = ipAddress;
    }

    await this.loginAttemptRepository.delete(whereClause);
  }

  async unlockAccount(email: string): Promise<void> {
    await this.loginAttemptRepository.update(
      { email, lockedUntil: MoreThan(new Date()) },
      { lockedUntil: null }
    );
  }
}