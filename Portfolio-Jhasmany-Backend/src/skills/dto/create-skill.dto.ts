import { IsString, IsOptional, IsBoolean, IsNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const STORED_IMAGE_URL_REGEX = /^$|^\/api\/images\/[0-9a-fA-F-]{36}$/;

export class CreateSkillDto {
  @ApiProperty({
    description: 'Skill name',
    example: 'JavaScript',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Skill icon (emoji or text)',
    example: '💻',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Skill image URL',
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
    description: 'Display order',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the skill is published',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
