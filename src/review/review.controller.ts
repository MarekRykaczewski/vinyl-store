import { Controller, Post, Param, Body, Req } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('vinyl-records/:vinylRecordId/reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

  @Post()
    async createReview(
    @Param('vinylRecordId') vinylRecordId: number,
    @Body('comment') comment: string,
    @Body('score') score: number,
    @Req() req
    ) {
        const user = req.user;
        return this.reviewService.createReview(user, vinylRecordId, comment, score);
    }
}
