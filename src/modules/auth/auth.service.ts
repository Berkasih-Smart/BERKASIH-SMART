import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { verifyPassword, signToken, verifyToken } from './auth.utils';

@Injectable()
export class AuthService {
  constructor(private readonly dataSource: DataSource) {}

  async login(payload: { email?: string; password?: string }) {
    if (!payload?.email || !payload?.password) {
      throw new BadRequestException('Email dan password wajib diisi.');
    }

    const user: any = await this.dataSource.getRepository('User').findOne({
      where: { email: payload.email.trim().toLowerCase() },
    });

    if (!user || !user.password_hash || !user.salt) {
      throw new UnauthorizedException('Email atau password tidak valid.');
    }

    const isValid = verifyPassword(payload.password, user.password_hash, user.salt);
    if (!isValid) {
      throw new UnauthorizedException('Email atau password tidak valid.');
    }

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
