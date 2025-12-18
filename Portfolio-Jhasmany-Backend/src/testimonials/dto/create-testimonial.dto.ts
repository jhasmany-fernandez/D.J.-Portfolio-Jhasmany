import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional, IsBoolean } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  feedback: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
