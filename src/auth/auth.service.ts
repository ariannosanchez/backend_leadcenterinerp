import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbExceptionHandler } from 'src/common/utils/db-exception.handler';
import { PrismaService } from 'src/common/database/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { email: true, password: true, id: true }
      });

      if (!user) {
        throw new UnauthorizedException('Credentials are not valid');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credentials are not valid');
      }

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw DbExceptionHandler.handle(error, AuthService.name)
    }
  }


  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;

  }

  // async generateJwtAccesToken(payload: PayloadToken) {
  //   try {

  //     const accessToken = this.jwtService.signAsync(payload, {
  //       secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
  //       expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRES_TIME')
  //     })

  //     return accessToken;

  //   } catch (error) {
  //     throw DbExceptionHandler.handle(error, AuthService.name)
  //   }
  // }

  // async generateJwtRefreshToken(payload: PayloadToken) {
  //   try {

  //     const refreshToken = this.jwtService.signAsync(payload, {
  //       secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
  //       expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRES_TIME')
  //     })

  //     return refreshToken;

  //   } catch (error) {
  //     throw DbExceptionHandler.handle(error, AuthService.name)
  //   }
  // }

  // Login usado en local strategy
  // async findUserToAuthenticated(loginAuthDto: LoginAuthDto) {
  //   try {
  //     // Buscar al usuario por email
  //     const user = await this.prisma.user.findUnique({
  //       where: {
  //         email: loginAuthDto.email,
  //       },
  //     });

  //     if (!user) {
  //       throw new UnauthorizedException(`User with email ${loginAuthDto.email} not valid`);
  //     }

  //     if (!user.isActive) {
  //       throw new UnauthorizedException(`User with email ${loginAuthDto.email} is inactive`);
  //     }

  //     // Verificar si la contraseña es correcta
  //     const isPasswordMatched = await this.hashingService.compare(loginAuthDto.password.trim(), user.password);

  //     if (!isPasswordMatched) {
  //       throw new UnauthorizedException('Credentials are not valid');
  //     }

  //     return user;
  //   } catch (error) {
  //     if (error instanceof UnauthorizedException) throw error;
  //     throw DbExceptionHandler.handle(error, AuthService.name);
  //   }
  // }
}
