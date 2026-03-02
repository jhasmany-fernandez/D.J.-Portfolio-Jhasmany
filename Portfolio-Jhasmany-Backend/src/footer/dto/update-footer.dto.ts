import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFooterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locationLine1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locationLine2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  codepenUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  availableLanguages?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
