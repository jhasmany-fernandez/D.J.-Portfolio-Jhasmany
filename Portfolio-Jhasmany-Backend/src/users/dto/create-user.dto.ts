import { IsEmail, IsString, MinLength, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SanitizeText, SanitizeEmail } from '../../common/decorators/sanitize.decorator';
import { IsStrongPassword } from '../../common/decorators/is-strong-password.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'Jhasmany Fernandez',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, { message: 'Name can only contain letters and spaces' })
  @SanitizeText()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'jhasmany@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @SanitizeEmail()
  email: string;

  @ApiProperty({
    description: 'User password - must be strong',
    example: 'MySecure123!',
    minLength: 8,
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    required: false,
    enum: ['user', 'admin'],
  })
  @IsOptional()
  @IsString()
  @Matches(/^(user|admin)$/, { message: 'Role must be either user or admin' })
  role?: string = 'user';
}