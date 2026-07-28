import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTestimonialsSectionDto {
  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  subtitleEs?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
