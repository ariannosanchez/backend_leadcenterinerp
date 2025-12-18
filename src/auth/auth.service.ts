import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { DbExceptionHandler } from 'src/common/utils/db-exception.handler';
import { PrismaService } from 'src/common/database/prisma.service';
import { HashingService } from 'src/common/providers/hashing/hashing.service';
import { PayloadToken } from './interfaces/token.entity';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    @Inject(config.KEY) private readonly configService: ConfigType<typeof config>,
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) { }

  // async generateJwtAccesToken(payload: PayloadToken){
  //   try {
      
  //     const accessToken = this.jwtService.signAsync(payload, {
  //       secret: this.configService.session.jwtAccessTokenSecret,
  //       expiresIn: this.configService.session.jwtAccessTokenExpires
  //     })

  //     return accessToken;

  //   } catch (error) {
  //     throw DbExceptionHandler.handle(error, AuthService.name)
  //   }
  // }

  // async generateJwtRefreshToken(payload: PayloadToken){
  //   try {
      
  //     const refreshToken = this.jwtService.signAsync(payload, {
  //       secret: this.configService.session.jwtRefreshTokenExpiresTime,
  //       expiresIn: this.configService.session.jwtRefreshTokenExpiresTime
  //     })

  //     return refreshToken;

  //   } catch (error) {
  //     throw DbExceptionHandler.handle(error, AuthService.name)
  //   }
  // }

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
