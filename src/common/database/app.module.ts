import { Module } from '@nestjs/common';
import { LeadStatusModule } from '../../lead-status/lead-status.module';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';

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
