import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from 'src/common/providers/hashing/hashing.service';
import { BcryptService } from 'src/common/providers/hashing/bcrypt.service';

@Module({
  controllers: [AuthController],
  providers: [{ provide: HashingService, useClass: BcryptService }, AuthService],
})
export class AuthModule { }
