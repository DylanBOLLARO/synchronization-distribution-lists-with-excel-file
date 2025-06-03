import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common'
import { CreateProgressDto } from './dto/create-progress.dto'
import { ProgressService } from './progress.service'

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Post()
    async create(@Body() createProgressDto: CreateProgressDto) {
        return await this.progressService.create(createProgressDto)
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
