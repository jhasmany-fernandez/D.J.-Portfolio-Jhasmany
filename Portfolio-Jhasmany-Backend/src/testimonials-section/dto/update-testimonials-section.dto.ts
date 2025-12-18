import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTestimonialsSectionDto {
  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
