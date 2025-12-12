import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashingService } from 'src/common/providers/hashing/hashing.service';
import { BcryptService } from 'src/common/providers/hashing/bcrypt.service';

@Module({
  controllers: [UsersController],
  providers: [{ provide: HashingService, useClass: BcryptService }, UsersService],
})
export class UsersModule { }
