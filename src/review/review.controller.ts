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
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('vinyl-records')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

  @Post('/:vinylRecordId/reviews')
    async createReview(
    @Param('vinylRecordId') vinylRecordId: number,
    @Body('comment') comment: string,
    @Body('score') score: number,
    @Req() req
    ) {
        const user = req.user;
        return this.reviewService.createReview(user, vinylRecordId, comment, score);
    }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteReview(@Param('id') id: number): Promise<{ message: string }> {
      await this.reviewService.delete(id);
      return { message: 'Review deleted successfully' };
  }

  @Get('/:vinylRecordId/reviews')
  async getReviewsByVinylRecord(
    @Param('vinylRecordId') vinylRecordId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
      return await this.reviewService.getReviewsByVinylRecord(
          vinylRecordId,
          page,
          limit
      );
  }
}
