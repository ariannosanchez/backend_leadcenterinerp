import { Injectable, InternalServerErrorException, ConflictException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLeadStatusDto } from './dto/create-lead-status.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import { LeadStatus, Prisma } from 'generated/prisma/client';
import { DbExceptionHandler } from 'src/common/utils/db-exception.handler';
import { ApiTags } from '@nestjs/swagger';
import { FilterLeadStatusDto } from './dto/filter-lead-status.dto';
import { PaginationHelper, PaginationResponse } from 'src/common/utils/pagination.helper';

@ApiTags('Lead Status')
@Injectable()
export class LeadStatusService {
  private readonly logger = new Logger(LeadStatusService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(createLeadStatusDto: CreateLeadStatusDto): Promise<LeadStatus> {
    try {
      return await this.prisma.leadStatus.create({
        data: createLeadStatusDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, LeadStatusService.name);
    }
  }

  async findAll(filters: FilterLeadStatusDto): Promise<PaginationResponse<LeadStatus>> {
    try {
      const { limit = 10, offset = 0, name, isActive = true } = filters;

      const where: Prisma.LeadStatusWhereInput = {};

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (name) {
        where.name = {
          contains: name,
          mode: 'insensitive',
        };
      }

      const [data, total] = await Promise.all([
        this.prisma.leadStatus.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.leadStatus.count({
          where,
        })
      ])

      return {
        data,
        meta: PaginationHelper.buildMeta(total, limit, offset, data.length),
      }

    } catch (error) {
      throw DbExceptionHandler.handle(error, LeadStatusService.name);
    }
  }

  async findOne(id: string): Promise<LeadStatus> {
    try {
      const leadStatus = await this.prisma.leadStatus.findUnique({
        where: {
          id,
        },
      });

      if (!leadStatus) {
        throw new NotFoundException(`LeadStatus with ID ${id} not found`);
      }

      if (!leadStatus.isActive) {
        throw new NotFoundException(`Lead Status with ID ${id} is inactive`);
      }
      return leadStatus;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, LeadStatusService.name);
    }
  }

  async update(id: string, updateLeadStatusDto: UpdateLeadStatusDto): Promise<LeadStatus> {
    try {
      await this.findOne(id);
      return await this.prisma.leadStatus.update({
        where: {
          id,
        },
        data: updateLeadStatusDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, LeadStatusService.name);
    }
  }

  async delete(id: string) {
    try {
      await this.findOne(id);

      return await this.prisma.leadStatus.update({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, LeadStatusService.name);
    }
  }

}
