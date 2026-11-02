import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { verifyPassword, signToken, verifyToken } from './auth.utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class AuthService {
  private readonly failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

  constructor(private readonly dataSource: DataSource) {}

  async login(payload: { email?: string; password?: string }) {
    if (!payload?.email || !payload?.password) {
      throw new BadRequestException('Email dan password wajib diisi.');
    }

    const email = payload.email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestException('Format alamat email tidak valid.');
    }

    if (typeof payload.password !== 'string' || payload.password.length < 6) {
      throw new BadRequestException('Kata sandi harus minimal 6 karakter.');
    }

    // Check account lockout
    const attempt = this.failedAttempts.get(email);
    if (attempt && attempt.lockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      throw new HttpException(
        `Terlalu banyak percobaan masuk yang gagal. Akun dikunci sementara selama ${remainingMinutes} menit.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user: any = await this.dataSource.getRepository('User').findOne({
      where: { email },
    });

    if (!user || !user.password_hash || !user.salt) {
      this.recordFailedAttempt(email);
      throw new UnauthorizedException('Email atau password tidak valid.');
    }

    const isValid = verifyPassword(payload.password, user.password_hash, user.salt);
    if (!isValid) {
      this.recordFailedAttempt(email);
      throw new UnauthorizedException('Email atau password tidak valid.');
    }

    // Reset failed attempts on success
    this.failedAttempts.delete(email);

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      customer_id: user.customer_id,
      partner_id: user.partner_id,
    };

    const token = signToken(tokenPayload);

    const { password_hash, salt, ...safeUser } = user;

    return {
      success: true,
      token,
      user: safeUser,
    };
  }

  private recordFailedAttempt(email: string) {
    const existing = this.failedAttempts.get(email) || { count: 0, lockedUntil: 0 };
    const count = existing.count + 1;
    let lockedUntil = 0;

    if (count >= 5) {
      lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
    }

    this.failedAttempts.set(email, { count, lockedUntil });
  }

  async validateToken(token: string) {
    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token tidak valid atau telah kedaluwarsa.');
    }

    const user: any = await this.dataSource.getRepository('User').findOne({
      where: { id: payload.sub },
    });

    if (!user || user.status === 'INACTIVE') {
      throw new UnauthorizedException('Pengguna tidak aktif.');
    }

    const { password_hash, salt, ...safeUser } = user;
    return safeUser;
  }
}
