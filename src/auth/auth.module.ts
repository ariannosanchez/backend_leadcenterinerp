import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET)
        return {
          secret: configService.get('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
