import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import { Prisma, User } from 'generated/prisma/client';
import { FilterUserDto } from './dto/filter-user.dto';
import { DbExceptionHandler } from 'src/common/utils/db-exception.handler';
import { PaginationHelper, PaginationResponse } from 'src/common/utils/pagination.helper';
import { HashingService } from 'src/common/providers/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await this.hashingService.hash(createUserDto.password);
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        }
      })
      return user;
    } catch (error) {
      throw DbExceptionHandler.handle(error, UsersService.name);
    }
  }

  async findAll(filters: FilterUserDto): Promise<PaginationResponse<User>> {
    try {

      const where: Prisma.UserWhereInput = {};

      const { limit = 10, offset = 0, firstName, lastName, email, isActive = true } = filters;

      if (firstName) {
        where.firstName = {
          contains: firstName,
          mode: 'insensitive',
        };
      }

      if (lastName) {
        where.lastName = {
          contains: lastName,
          mode: 'insensitive',
        };
      }

      if (email) {
        where.email = {
          contains: email,
          mode: 'insensitive',
        };
      }

      const [data, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({
          where,
        })
      ])

      return {
        data,
        meta: PaginationHelper.buildMeta(total, limit, offset, data.length),
      }

    } catch (error) {
      throw DbExceptionHandler.handle(error, UsersService.name);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (!user.isActive) {
        throw new NotFoundException(`User with ID ${id} is inactive`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, UsersService.name);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id);
      /** Hashear la contraseña */
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      })
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, UsersService.name);
    }
  }

  async delete(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      })
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, UsersService.name);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.user.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw DbExceptionHandler.handle(error, UsersService.name);
    }
  }
}
