import { Injectable } from '@nestjs/common'
import { randomInt } from 'crypto'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProgressDto } from './dto/create-progress.dto'
import { UpdateProgressDto } from './dto/update-progress.dto'

@Injectable()
export class ProgressService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createProgressDto: CreateProgressDto) {
        return await this.prismaService.progress.create({
            data: {
                description: 'Téléchargement des données initiales',
                progress: 0,
                status: 'IN_PROGRESS',
            },
        })
    }

    async getCurrentProgress() {
        const inProgress = await this.prismaService.progress.findMany({
            where: {
                status: {
                    equals: 'IN_PROGRESS',
                },
            },
        })

        if (inProgress.length === 0 || inProgress.length > 1) {
            return null
        }

        return inProgress[0]
    }

    async update(id: string, progress: any) {
        await this.prismaService.progress.update({
            where: {
                id,
            },
            // TODO use custom pipe for transform value into number
            data: { ...progress, progress: +(progress.progress ?? 100) },
        })
    }
}
