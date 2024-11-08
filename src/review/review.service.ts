import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';
import { User } from 'src/user/user.entity';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
    constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    @InjectRepository(VinylRecord)
    private vinylRecordRepository: Repository<VinylRecord>,

    private readonly logger: WinstonLoggerService
    ) {}

    async getReviewsByVinylRecord(
        vinylRecordId: number,
        page: number,
        limit: number
    ) {
        const [data, total] = await this.reviewRepository.findAndCount({
            where: { vinylRecord: { id: vinylRecordId } },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            total,
            currentPage: page,
            totalPages,
        };
    }

    async createReview(
        user: User,
        createReviewDto: CreateReviewDto
    ): Promise<Review> {
        const { vinylRecordId, content, score } = createReviewDto;

        const vinylRecord = await this.vinylRecordRepository.findOne({
            where: { id: vinylRecordId },
        });
        if (!vinylRecord) throw new Error('Vinyl record not found');

        const review = this.reviewRepository.create({
            user,
            vinylRecord,
            content,
            score,
        } as DeepPartial<Review>);
        // Save review first to get an ID
        const savedReview = await this.reviewRepository.save(review);

        // Now `savedReview.id` should be defined
        this.logger.log(
            `Review with id ${savedReview.id} created for vinyl record: ${vinylRecord.id}`
        );
        return this.reviewRepository.save(review);
    }

    async delete(id: number): Promise<void> {
        const result = await this.reviewRepository.delete(id);
        this.logger.log(`Review with id ${id} deleted`);
        if (result.affected === 0) {
            throw new NotFoundException('Review not found');
        }
    }
}
