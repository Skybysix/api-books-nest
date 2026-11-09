import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, // para buscar y crear usuarios
        private readonly jwtService: JwtService, // para crear tokens
    ) { }

    async register(dto: RegisterDto) {
        // 1. ¿Ya existe ese correo?
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Ese correo ya está registrado'); // → 409
        }

        // 2. Calculamos el hash. La contraseña NO se guarda
        const passwordHash = await argon2.hash(dto.password);

        // 3. Guardamos el usuario
        const user = await this.usersService.create(dto.email, passwordHash);

        // 4. Respondemos SIN el hash
        return { id: user.id, email: user.email, role: user.role };
    }

    async login(dto: LoginDto) {
        // 1. Buscamos al usuario por su correo
        const user = await this.usersService.findByEmail(dto.email);

        // 2. ¿Existe y la contraseña encaja con su hash?
        // Mismo mensaje en los dos casos: así nadie averigua qué correos existen
        if (
            !user ||
            !(await argon2.verify(user.password_hash, dto.password))
        ) {
            throw new UnauthorizedException('Correo o contraseña incorrectos'); // → 401
        }

        // 3. Lo que irá dentro del token: SOLO el id
        const payload: JwtPayload = { sub: user.id };

        // 4. Creamos el token y lo firmamos con la clave secreta
        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }

    async me(userId: number) {
        // El token solo traía el id: el resto lo sacamos de la base de datos
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new UnauthorizedException('El usuario ya no existe');
        }

        // Nunca devolvemos el hash de la contraseña
        return { id: user.id, email: user.email, role: user.role };
    }
}