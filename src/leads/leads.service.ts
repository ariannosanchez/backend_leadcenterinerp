import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import { Lead, Prisma } from 'generated/prisma/client';
import { DbExceptionHandler } from 'src/common/utils/db-exception.handler';
import { FilterLeadDto } from './dto/filter-lead.dto';
import { PaginationHelper, PaginationResponse } from 'src/common/utils/pagination.helper';

@Injectable()
export class LeadsService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    try {
      const lead = await this.prisma.lead.create({
        data: createLeadDto,
      });
      return lead
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw DbExceptionHandler.handle(error, LeadsService.name);
    }
  }

  async findAll(filters: FilterLeadDto): Promise<PaginationResponse<Lead>> {
    try {

      const where: Prisma.LeadWhereInput = {};

      const { limit = 10, offset = 0, statusId, userId } = filters;

      if (statusId) {
        where.statusId = {
          contains: statusId,
          mode: 'insensitive',
        }
      }

      if (userId) {
        where.userId = {
          contains: userId,
          mode: 'insensitive',
        }
      }

      const [data, total] = await Promise.all([
        this.prisma.lead.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.lead.count({
          where,
        })
      ])

      return {
        data,
        meta: PaginationHelper.buildMeta(total, limit, offset, data.length),
      }

    } catch (error) {
      throw DbExceptionHandler.handle(error, LeadsService.name);
    }
  }

  async findOne(id: string): Promise<Lead> {
    try {
      const lead = await this.prisma.lead.findUnique({
        where: {
          id,
        },
      })

      if (!lead) {
        throw new NotFoundException(`Lead with id ${id} not found`)
      }

      if (!lead.isActive) {
        throw new NotFoundException(`Lead with id ${id} is inactive`)
      }

      return lead;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, LeadsService.name);
    }
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    try {
      await this.findOne(id);

      return await this.prisma.lead.update({
        where: {
          id,
        },
        data: updateLeadDto,
      })

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, LeadsService.name);
    }
  }

  async delete(id: string) {
    try {
      await this.findOne(id);

      return await this.prisma.lead.update({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      })
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, LeadsService.name);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return await this.prisma.lead.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, LeadsService.name);
    }
  }
}
