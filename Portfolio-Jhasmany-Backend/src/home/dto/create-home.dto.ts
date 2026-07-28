import { IsString, IsArray, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const IMAGE_URL_REGEX = /^$|^\/api\/images\/[0-9a-fA-F-]{36}$|^\/portfolio-assets\/[\w./-]+$/;

export class CreateHomeDto {
  @ApiProperty({
    description: 'Greeting text',
    example: "Hi - I'm Jhasmany Fernandez",
  })
  @IsString()
  greeting: string;

  @ApiProperty({
    description: 'Greeting text in Spanish',
    example: 'Hola, soy Jhasmany Fernandez',
    required: false,
  })
  @IsOptional()
  @IsString()
  greetingEs?: string;

  @ApiProperty({
    description: 'Array of roles to display',
    example: ['FULLSTACK DEVELOPER', 'INDIE HACKER', 'SOLOPRENEUR'],
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @ApiProperty({
    description: 'Array of roles to display in Spanish',
    example: ['DESARROLLADOR FULLSTACK', 'HACKER ETICO'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rolesEs?: string[];

  @ApiProperty({
    description: 'Description text',
    example: 'Crafting innovative solutions to solve real-world problems',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Description text in Spanish',
    example: 'Construyo aplicaciones web, APIs y sistemas administrativos.',
    required: false,
  })
  @IsOptional()
  @IsString()
  descriptionEs?: string;

  @ApiProperty({
    description: 'Hero image URL',
    example: '/api/images/550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(IMAGE_URL_REGEX, {
    message: 'imageUrl must be a stored image URL like /api/images/{uuid} or a local asset URL like /portfolio-assets/file.png',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Primary button text',
    example: 'Acceso Personal',
    required: false,
  })
  @IsOptional()
  @IsString()
  primaryButtonText?: string;

  @ApiProperty({
    description: 'Primary button text in Spanish',
    example: 'Acceso Personal',
    required: false,
  })
  @IsOptional()
  @IsString()
  primaryButtonTextEs?: string;

  @ApiProperty({
    description: 'Primary button URL',
    example: '/auth/login',
    required: false,
  })
  @IsOptional()
  @IsString()
  primaryButtonUrl?: string;

  @ApiProperty({
    description: 'Secondary button text',
    example: 'Newsletter Clientes',
    required: false,
  })
  @IsOptional()
  @IsString()
  secondaryButtonText?: string;

  @ApiProperty({
    description: 'Secondary button text in Spanish',
    example: 'Newsletter Clientes',
    required: false,
  })
  @IsOptional()
  @IsString()
  secondaryButtonTextEs?: string;

  @ApiProperty({
    description: 'Secondary button URL',
    example: '/newsletter/subscribe',
    required: false,
  })
  @IsOptional()
  @IsString()
  secondaryButtonUrl?: string;

  @ApiProperty({
    description: 'Whether this section is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
