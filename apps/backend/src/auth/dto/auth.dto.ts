import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsEmail({}, { message: 'Must be a valid email' })
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
