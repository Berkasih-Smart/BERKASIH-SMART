import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token otentikasi tidak ditemukan.');
    }

    const token = authHeader.slice(7).trim();
    const user = await this.authService.validateToken(token);

    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Akses ditolak: Hanya SUPER_ADMIN yang diizinkan melakukan operasi ini.');
    }

    request.user = user;
    return true;
  }
}
