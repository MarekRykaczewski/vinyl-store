import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';
import { Review } from './entities/review.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Review, VinylRecord])],
    providers: [ReviewService],
    controllers: [ReviewController],
})
export class ReviewModule {}
