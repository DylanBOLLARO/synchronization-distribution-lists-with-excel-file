import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ProgressService } from './progress.service'

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Post()
    async create() {
        return await this.progressService.create()
    }

    @Get('get-current-progress')
    async getCcurrentProgress() {
        return await this.progressService.getCurrentProgress()
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() progress: any) {
        return await this.progressService.update(id, progress)
    }
}
