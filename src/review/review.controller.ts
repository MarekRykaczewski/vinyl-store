import {
    Controller,
    Post,
    Param,
    Body,
    Req,
    Delete,
    UseGuards,
    Get,
    Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Vinyl Records')
@Controller('vinyl-records')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:vinylRecordId/reviews')
  @ApiOperation({
      summary: 'Create a review',
      description: 'Creates a review for a specified vinyl record.',
  })
  @ApiParam({
      name: 'vinylRecordId',
      description: 'ID of the vinyl record',
      type: Number,
  })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
    async createReview(
    @Param('vinylRecordId') vinylRecordId: number,
    @Body('comment') comment: string,
    @Body('score') score: number,
    @Req() req
    ) {
        const user = req.user;
        if (score < 1 || score > 5) {
            throw new Error('Score must be between 1 and 5');
        }
        return this.reviewService.createReview(user, vinylRecordId, comment, score);
    }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({
      summary: 'Delete a review',
      description: 'Deletes a review by its ID (Admin only).',
  })
  @ApiParam({
      name: 'id',
      description: 'ID of the review to delete',
      type: Number,
  })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
  @ApiResponse({
      status: 403,
      description: 'Forbidden - User lacks necessary permissions',
  })
  async deleteReview(@Param('id') id: number): Promise<{ message: string }> {
      await this.reviewService.delete(id);
      return { message: 'Review deleted successfully' };
  }

  @Get('/:vinylRecordId/reviews')
  @ApiOperation({
      summary: 'Get reviews by vinyl record',
      description:
      'Retrieves reviews for a specific vinyl record with pagination.',
  })
  @ApiParam({
      name: 'vinylRecordId',
      description: 'ID of the vinyl record',
      type: Number,
  })
  @ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      type: Number,
      required: false,
  })
  @ApiQuery({
      name: 'limit',
      description: 'Number of reviews per page',
      type: Number,
      required: false,
  })
  @ApiResponse({
      status: 200,
      description: 'List of reviews retrieved successfully',
  })
  async getReviewsByVinylRecord(
    @Param('vinylRecordId') vinylRecordId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
      if (page <= 0 || limit <= 0) {
          throw new Error('Page and limit must be greater than 0');
      }
      return await this.reviewService.getReviewsByVinylRecord(
          vinylRecordId,
          page,
          limit
      );
  }
}
