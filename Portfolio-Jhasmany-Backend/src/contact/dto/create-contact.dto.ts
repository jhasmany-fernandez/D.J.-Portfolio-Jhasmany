import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SanitizeText, SanitizeEmail, SanitizeHtml } from '../../common/decorators/sanitize.decorator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Contact person name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @SanitizeText()
  name: string;

  @ApiProperty({
    description: 'Contact person email',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @SanitizeEmail()
  email: string;

  @ApiProperty({
    description: 'Message subject',
    example: 'Project Inquiry',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Subject must not exceed 200 characters' })
  @SanitizeText()
  subject?: string;

  @ApiProperty({
    description: 'Contact message',
    example: 'I would like to discuss a potential project...',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  @MaxLength(2000, { message: 'Message must not exceed 2000 characters' })
  @SanitizeHtml()
  message: string;
}