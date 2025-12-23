import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/database/prisma.module';
import { LeadStatusModule } from './lead-status/lead-status.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    PrismaModule,
    LeadStatusModule,
    UsersModule,
    AuthModule,
    LeadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
