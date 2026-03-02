import { IsString, IsArray, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const STORED_IMAGE_URL_REGEX = /^$|^\/api\/images\/[0-9a-fA-F-]{36}$/;

export class CreateHomeDto {
  @ApiProperty({
    description: 'Greeting text',
    example: "Hi - I'm Jhasmany Fernandez",
  })
  @IsString()
  greeting: string;

  @ApiProperty({
    description: 'Array of roles to display',
    example: ['FULLSTACK DEVELOPER', 'INDIE HACKER', 'SOLOPRENEUR'],
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @ApiProperty({
    description: 'Description text',
    example: 'Crafting innovative solutions to solve real-world problems',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Hero image URL',
    example: '/api/images/550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(STORED_IMAGE_URL_REGEX, {
    message: 'imageUrl must be a stored image URL like /api/images/{uuid}',
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
