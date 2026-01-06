import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { FilterLeadDto } from './dto/filter-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.create(createLeadDto);
  }

  @Get()
  async findAll(@Query() filters: FilterLeadDto) {
    return await this.leadsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.leadsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return await this.leadsService.update(id, updateLeadDto);
  }

  @Patch(':id')
  async changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return await this.leadsService.update(id, updateLeadDto);
  }


  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.leadsService.delete(id);
  }

  // @Delete(':id')
  // async remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return await this.leadsService.remove(id);
  // }
}
