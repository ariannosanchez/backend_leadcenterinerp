import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { LeadStatusService } from './lead-status.service';
import { CreateLeadStatusDto } from './dto/create-lead-status.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { FilterLeadStatusDto } from './dto/filter-lead-status.dto';

@Controller('lead-status')
export class LeadStatusController {
  constructor(private readonly leadStatusService: LeadStatusService) { }

  @Post()
  async create(@Body() createLeadStatusDto: CreateLeadStatusDto) {
    return await this.leadStatusService.create(createLeadStatusDto);
  }

  @Get()
  async findAll(@Query() filters: FilterLeadStatusDto) {
    return await this.leadStatusService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadStatusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLeadStatusDto: UpdateLeadStatusDto) {
    return this.leadStatusService.update(id, updateLeadStatusDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadStatusService.delete(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return "";
  }
}
