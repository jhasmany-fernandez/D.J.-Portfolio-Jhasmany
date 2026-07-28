import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServicesSectionDto {
  @ApiProperty({
    description: 'Subtitle for the services section',
    example: 'I offer a wide range of services to ensure you have the best written code and stay ahead in the competition.',
  })
  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @ApiProperty({
    description: 'Subtitle for the services section in Spanish',
    example: 'Ofrezco una amplia gama de servicios para crear soluciones web modernas.',
    required: false,
  })
  @IsString()
  @IsOptional()
  subtitleEs?: string;
}
