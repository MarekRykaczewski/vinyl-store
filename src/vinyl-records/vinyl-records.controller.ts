import {
    BadRequestException,
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
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateVinylRecordDto } from './dto/create-vinyl-record.dto';
import { UpdateVinylRecordDto } from './dto/update-vinyl-record.dto';

@ApiTags('Vinyl Records')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('vinyl-records')
export class VinylRecordsController {
    constructor(private readonly vinylRecordsService: VinylRecordsService) {}

  @Get()
  @ApiOperation({
      summary: 'Get all vinyl records',
      description: 'Retrieves a paginated list of vinyl records.',
  })
  @ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      type: Number,
      required: false,
  })
  @ApiQuery({
      name: 'limit',
      description: 'Number of records per page',
      type: Number,
      required: false,
  })
  @ApiResponse({
      status: 200,
      description: 'List of vinyl records retrieved successfully',
  })
    async getVinylRecords(
    @Query('page') page = 1,
    @Query('limit') limit = 10
    ): Promise<{
    data: VinylRecordDto[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
        if (page <= 0 || limit <= 0) {
            throw new BadRequestException('Page and limit must be greater than 0');
        }
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

  @Get('search')
  @ApiOperation({
      summary: 'Search and sort vinyl records',
      description: 'Searches and sorts vinyl records based on a search term.',
  })
  @ApiQuery({
      name: 'searchTerm',
      description: 'Search term for filtering vinyl records',
      type: String,
      required: true,
  })
  @ApiQuery({
      name: 'sortBy',
      description: 'Sorting parameter',
      type: String,
      enum: ['price', 'name', 'authorName'],
      required: false,
  })
  @ApiQuery({
      name: 'order',
      description: 'Sorting order',
      type: String,
      enum: ['ASC', 'DESC'],
      required: false,
  })
  @ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      type: Number,
      required: false,
  })
  @ApiQuery({
      name: 'limit',
      description: 'Number of records per page',
      type: Number,
      required: false,
  })
  @ApiResponse({
      status: 200,
      description:
      'Filtered and sorted list of vinyl records retrieved successfully',
  })
  async searchVinylRecords(
    @Query('searchTerm') searchTerm: string,
    @Query('sortBy') sortBy: 'price' | 'name' | 'authorName',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
      return await this.vinylRecordsService.searchAndSortVinylRecords(
          searchTerm,
          sortBy,
          order,
          page,
          limit
      );
  }

  @Post()
  @ApiOperation({
      summary: 'Create a new vinyl record',
      description: 'Creates a new vinyl record. (Admin only)',
  })
  @ApiResponse({
      status: 201,
      description: 'Vinyl record created successfully',
  })
  @ApiResponse({
      status: 403,
      description: 'Forbidden - User lacks necessary permissions',
  })
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async createVinylRecord(@Body() createVinylRecordDto: CreateVinylRecordDto) {
      return this.vinylRecordsService.create(createVinylRecordDto);
  }

  @Patch(':id')
  @ApiOperation({
      summary: 'Update vinyl record',
      description: 'Updates an existing vinyl record by ID. (Admin only)',
  })
  @ApiParam({
      name: 'id',
      description: 'ID of the vinyl record to update',
      type: Number,
  })
  @ApiResponse({
      status: 200,
      description: 'Vinyl record updated successfully',
  })
  @ApiResponse({
      status: 403,
      description: 'Forbidden - User lacks necessary permissions',
  })
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateVinylRecord(
    @Param('id') id: number,
    @Body() updateVinylRecordDto: UpdateVinylRecordDto
  ) {
      return this.vinylRecordsService.update(id, updateVinylRecordDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({
      summary: 'Delete vinyl record',
      description: 'Deletes a vinyl record by ID. (Admin only)',
  })
  @ApiParam({
      name: 'id',
      description: 'ID of the vinyl record to delete',
      type: Number,
  })
  @ApiResponse({
      status: 200,
      description: 'Vinyl record deleted successfully',
  })
  @ApiResponse({
      status: 403,
      description: 'Forbidden - User lacks necessary permissions',
  })
  async deleteVinylRecord(@Param('id') id: number) {
      return this.vinylRecordsService.delete(id);
  }
}
