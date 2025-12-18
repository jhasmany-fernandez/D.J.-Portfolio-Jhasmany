import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServicesSectionDto {
  @ApiProperty({
    description: 'Subtitle for the services section',
    example: 'I offer a wide range of services to ensure you have the best written code and stay ahead in the competition.',
  })
  @IsString()
  @IsNotEmpty()
  subtitle: string;
}
