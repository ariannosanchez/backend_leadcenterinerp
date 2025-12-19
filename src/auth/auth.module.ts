import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from 'src/common/providers/hashing/hashing.service';
import { BcryptService } from 'src/common/providers/hashing/bcrypt.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [{ provide: HashingService, useClass: BcryptService }, AuthService, LocalStrategy, JwtStrategy],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_ACCESS_EXPIRES_TIME')
          }
        }
      }
    })
  ]
})
export class AuthModule { }
