import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/database/prisma.module';
import { LeadStatusModule } from './lead-status/lead-status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    PrismaModule,
    LeadStatusModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
