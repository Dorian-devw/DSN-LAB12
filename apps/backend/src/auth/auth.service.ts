import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RequestOtpDto, VerifyOtpDto, RefreshTokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(dto: RequestOtpDto) {
    const { email } = dto;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    await this.prisma.otpCode.create({
      data: {
        email,
        otpCode,
        expiresAt,
      },
    });

    await this.sendEmailOtp(email, otpCode);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otpCode } = dto;

    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        email,
        otpCode,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { email },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    return this.generateTokens(user.id, user.role);
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const session = await this.prisma.userSession.findFirst({
        where: {
          userId: payload.sub,
          refreshToken: dto.refreshToken,
          expiresAt: { gt: new Date() },
        },
      });

      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }

      return this.generateTokens(payload.sub, payload.role);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token session
    await this.prisma.userSession.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        role,
      }
    };
  }

  private async sendEmailOtp(to: string, otp: string) {
    const apiKey = process.env.EMAIL_API_KEY;
    if (!apiKey) {
      console.warn('EMAIL_API_KEY not found. Skipping email sending. OTP is:', otp);
      return;
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'GOLEATE!', email: 'noreply@goleate.com' },
          to: [{ email: to }],
          subject: 'Your GOLEATE! Login Code',
          htmlContent: `<html><body><h1>Your OTP Code</h1><p>Your login code is <strong>${otp}</strong>. It expires in 10 minutes.</p></body></html>`,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Failed to send email:', err);
      }
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }
}
