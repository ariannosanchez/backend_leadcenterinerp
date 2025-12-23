import { Module } from '@nestjs/common';
import { LeadStatusService } from './lead-status.service';
import { LeadStatusController } from './lead-status.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [LeadStatusController],
  providers: [LeadStatusService],
  imports: [
    AuthModule,
  ]
})
export class LeadStatusModule { }
