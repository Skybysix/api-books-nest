import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthRequest } from './jwt-payload';

// AUTORIZACIÓN: ¿eres administrador?
// Va siempre DESPUÉS de AuthGuard
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    

    // Buscamos el usuario en la base de datos.
    const user = await this.usersService.findById(request.userId);
    console.log('ADMIN GUARD:', user?.email, user?.role);

    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe');
    }

    // Solo los administradores pueden continuar.
    if (user.role !== 'admin') {
      throw new ForbiddenException('Solo para administradores');
    }

    return true;
  }
}