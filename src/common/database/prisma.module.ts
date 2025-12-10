// prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }