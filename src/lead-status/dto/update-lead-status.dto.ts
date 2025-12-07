import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadStatusDto } from './create-lead-status.dto';

export class UpdateLeadStatusDto extends PartialType(CreateLeadStatusDto) { }
