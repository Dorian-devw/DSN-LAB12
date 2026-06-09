import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsEmail({}, { message: 'Must be a valid email' })
  @Matches(/^[a-zA-Z0-9._%+-]+@tecsup\.edu\.pe$/, {
    message: 'Must be a valid @tecsup.edu.pe institutional email',
  })
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otpCode: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
