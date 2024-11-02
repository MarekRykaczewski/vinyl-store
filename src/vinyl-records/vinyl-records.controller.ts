import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { VinylRecordsService } from './vinyl-records.service';
import { VinylRecordDto } from './dto/vinyl-records.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateVinylRecordDto } from './dto/create-vinyl-record.dto';
import { UpdateVinylRecordDto } from './dto/update-vinyl-record.dto';

@ApiBearerAuth()
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

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async createVinylRecord(@Body() createVinylRecordDto: CreateVinylRecordDto) {
      return this.vinylRecordsService.create(createVinylRecordDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateVinylRecord(
    @Param('id') id: number,
    @Body() updateVinylRecordDto: UpdateVinylRecordDto
  ) {
      return this.vinylRecordsService.update(id, updateVinylRecordDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteVinylRecord(@Param('id') id: number) {
      return this.vinylRecordsService.delete(id);
  }
}
