import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    Logger,
    BadRequestException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

export class DbExceptionHandler {
    static handle(error: unknown, context: string = 'Database'): never {
        const logger = new Logger(context);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const { code } = error;

            switch (code) {
                case 'P2002':
                    logger.warn('Unique constraint violation');
                    throw new ConflictException('Record already exists');

                case 'P2025':
                    logger.warn('Record not found');
                    throw new NotFoundException('Record not found');

                case 'P2003':
                    logger.warn('Foreign key constraint violation');
                    throw new BadRequestException('Cannot delete due to existing dependencies');
            }
        }

        logger.error('Unexpected database error', error);
        throw new InternalServerErrorException('Unexpected server error');
    }
}