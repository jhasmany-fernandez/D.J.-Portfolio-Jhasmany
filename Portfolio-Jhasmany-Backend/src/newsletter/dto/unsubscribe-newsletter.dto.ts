import { IsNotEmpty, IsString } from 'class-validator';

export class UnsubscribeNewsletterDto {
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Unsubscribe token is required' })
  token: string;
}