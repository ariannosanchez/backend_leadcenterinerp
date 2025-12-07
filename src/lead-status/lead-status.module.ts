import { Module } from '@nestjs/common';
import { LeadStatusService } from './lead-status.service';
import { LeadStatusController } from './lead-status.controller';

@Module({
  controllers: [LeadStatusController],
  providers: [LeadStatusService],
})
export class LeadStatusModule { }
