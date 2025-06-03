import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProgressController } from './progress.controller'
import { ProgressService } from './progress.service'

@Module({
    controllers: [ProgressController],
    providers: [ProgressService, PrismaService],
})
export class ProgressModule {}
