import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Service title',
    example: 'JavaScript Development',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Short description of the service',
    example: 'Creating dynamic and interactive web applications using JavaScript.',
  })
  @IsString()
  shortDescription: string;

  @ApiProperty({
    description: 'Icon identifier or name',
    example: 'JavaScriptIcon',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Image URL for the service',
    example: '/api/images/service-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Technologies used for this service',
    example: ['React', 'Node.js', 'TypeScript'],
    required: false,
    isArray: true,
  })
  @IsOptional()
  technologies?: string[];

  @ApiProperty({
    description: 'Experience level or years',
    example: '5+ años',
    required: false,
  })
  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @ApiProperty({
    description: 'Demo URL for the service',
    example: 'https://demo.example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  demoUrl?: string;

  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/username/repo',
    required: false,
  })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiProperty({
    description: 'Number of clients served',
    example: '50+',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientsServed?: string;

  @ApiProperty({
    description: 'Number of projects completed',
    example: '100+',
    required: false,
  })
  @IsOptional()
  @IsString()
  projectsCompleted?: string;

  @ApiProperty({
    description: 'Service ratings',
    example: '4.9/5',
    required: false,
  })
  @IsOptional()
  @IsString()
  ratings?: string;

  @ApiProperty({
    description: 'Show demo URL in portfolio',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showDemoInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show GitHub URL in portfolio',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showGithubInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show clients served in portfolio',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showClientsServedInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show projects completed in portfolio',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showProjectsCompletedInPortfolio?: boolean;

  @ApiProperty({
    description: 'Show ratings in portfolio',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showRatingsInPortfolio?: boolean;

  @ApiProperty({
    description: 'Display order',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the service is published',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
