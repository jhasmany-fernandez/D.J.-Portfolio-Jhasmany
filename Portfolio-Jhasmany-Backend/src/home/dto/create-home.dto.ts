import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    example: '/images/hero.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Whether this section is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
