import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VinylRecordsService } from './vinyl-records.service';
import { VinylRecordDto } from './dto/vinyl-records.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('vinyl-records')
export class VinylRecordsController {
    constructor(private readonly vinylRecordsService: VinylRecordsService) {}

  @Get()
    async getVinylRecords(
    @Query('page') page = 1,
    @Query('limit') limit = 10
    ): Promise<{
    data: VinylRecordDto[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
        const { data, total } = await this.vinylRecordsService.getVinylRecords(
            page,
            limit
        );
        const totalPages = Math.ceil(total / limit);

        return {
            data,
            total,
            currentPage: page,
            totalPages,
        };
    }
}
