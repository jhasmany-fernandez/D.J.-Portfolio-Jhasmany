import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GoogleOAuthDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  redirectUri: string;
}
