import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRequest } from './jwt-payload';

// AUTORIZACIÓN: ¿eres empleado?
// Va siempre DESPUÉS de AuthGuard
@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // request.userId lo ha puesto AuthGuard.
    // Buscamos el rol ACTUAL en la base de datos.
    const user = await this.usersService.findById(request.userId);

    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe');
    }

    if (user.role !== 'employee') {
      throw new ForbiddenException('Solo para empleados');
    }

    return true; // Es empleado: puede pasar
  }
}