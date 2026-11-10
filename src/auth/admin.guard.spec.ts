import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AdminGuard } from './admin.guard';

// Un contexto falso: una petición que ya trae el id del usuario
const context = {
  switchToHttp: () => ({
    getRequest: () => ({ userId: 1 }),
  }),
} as unknown as ExecutionContext;

describe('AdminGuard', () => {
  // Un UsersService FALSO
  const fakeUsersService = { findById: jest.fn() };

  const guard = new AdminGuard(
    fakeUsersService as unknown as UsersService,
  );

  it('deja pasar a un administrador', async () => {
    fakeUsersService.findById.mockResolvedValue({
      id: 1,
      role: 'admin',
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('no deja pasar a un empleado', async () => {
    fakeUsersService.findById.mockResolvedValue({
      id: 1,
      role: 'employee',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('no deja pasar a un cliente', async () => {
    fakeUsersService.findById.mockResolvedValue({
      id: 1,
      role: 'customer',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('lanza un 401 si el usuario no existe', async () => {
    fakeUsersService.findById.mockResolvedValue(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});