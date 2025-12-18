import { IsString, IsArray, IsOptional, IsUrl, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project title',
    example: 'Portfolio Website',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Project description',
    example: 'A modern portfolio website built with Next.js and NestJS',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Project short description',
    example: 'A modern portfolio website',
    required: false,
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({
    description: 'Project detailed content',
    example: 'This project showcases...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Technologies used',
    example: ['Next.js', 'NestJS', 'PostgreSQL', 'Docker'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @ApiProperty({
    description: 'Project image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Project cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  cover?: string;

  @ApiProperty({
    description: 'Demo URL',
    example: 'https://portfolio-demo.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  demoUrl?: string;

  @ApiProperty({
    description: 'Live preview URL',
    example: 'https://portfolio-demo.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  livePreview?: string;

  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/user/project',
    required: false,
  })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiProperty({
    description: 'GitHub link',
    example: 'https://github.com/user/project',
    required: false,
  })
  @IsOptional()
  @IsString()
  githubLink?: string;

  @ApiProperty({
    description: 'Project order for display',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Project priority',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiProperty({
    description: 'Project type',
    example: 'Client Work 🙍‍♂️',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Number of visitors',
    example: '8K Visitors',
    required: false,
  })
  @IsOptional()
  @IsString()
  visitors?: string;

  @ApiProperty({
    description: 'Amount earned',
    example: '$400',
    required: false,
  })
  @IsOptional()
  @IsString()
  earned?: string;

  @ApiProperty({
    description: 'GitHub stars',
    example: '40 Stars',
    required: false,
  })
  @IsOptional()
  @IsString()
  githubStars?: string;

  @ApiProperty({
    description: 'Number of sales',
    example: '138 Sales',
    required: false,
  })
  @IsOptional()
  @IsString()
  numberOfSales?: string;

  @ApiProperty({
    description: 'Site age',
    example: '1 month old',
    required: false,
  })
  @IsOptional()
  @IsString()
  siteAge?: string;

  @ApiProperty({
    description: 'Ratings',
    example: '4.5/5',
    required: false,
  })
  @IsOptional()
  @IsString()
  ratings?: string;

  @ApiProperty({
    description: 'Show live preview in portfolio',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showLivePreviewInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show GitHub link in portfolio',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showGithubInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show visitors in portfolio',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showVisitorsInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show earned in portfolio',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showEarnedInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show GitHub stars in portfolio',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showGithubStarsInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show ratings in portfolio',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showRatingsInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show number of sales in portfolio',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showNumberOfSalesInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show site age in portfolio',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showSiteAgeInPortfolio?: boolean;

  @ApiProperty({
    description: 'Whether the project is published',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}