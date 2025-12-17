import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { DbExceptionHandler } from 'src/common/utils/db-exception.handler';
import { PrismaService } from 'src/common/database/prisma.service';
import { HashingService } from 'src/common/providers/hashing/hashing.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) { }

  // Login usado en local strategy
  async findUserToAuthenticated(loginAuthDto: LoginAuthDto) {
    try {
      // Buscar al usuario por email
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginAuthDto.email,
        },
      });

      if (!user) {
        throw new UnauthorizedException(`User with email ${loginAuthDto.email} not valid`);
      }

      if (!user.isActive) {
        throw new UnauthorizedException(`User with email ${loginAuthDto.email} is inactive`);
      }

      // Verificar si la contraseña es correcta
      const isPasswordMatched = await this.hashingService.compare(loginAuthDto.password.trim(), user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Credentials are not valid');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw DbExceptionHandler.handle(error, AuthService.name);
    }
  }
}
