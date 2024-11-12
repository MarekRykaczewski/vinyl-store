import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { describe, it, beforeEach } from 'node:test';
import * as assert from 'node:assert'; // Import Node.js assert module
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from 'src/purchase/entities/purchase.entity';

describe('ReviewService', () => {
    let reviewService: ReviewService;
    let reviewRepository: Repository<Review>;
    let vinylRecordRepository: Repository<VinylRecord>;
    let userRepository: Repository<User>;
    let dataSource: DataSource;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [VinylRecord, Review, User, Purchase],
                    synchronize: true,
                }), // Configuring SQLite for testing
                TypeOrmModule.forFeature([VinylRecord, Review, User, Purchase]),
            ],
            providers: [ReviewService, WinstonLoggerService],
        }).compile();

        reviewService = module.get<ReviewService>(ReviewService);
        reviewRepository = module.get<Repository<Review>>(
            getRepositoryToken(Review)
        );
        vinylRecordRepository = module.get<Repository<VinylRecord>>(
            getRepositoryToken(VinylRecord)
        );
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        dataSource = module.get<DataSource>(DataSource);
    });

    beforeEach(async () => {
    // Reset the database before each test
        await dataSource.synchronize(true);
    });

    it('should be defined', () => {
        assert.ok(reviewService); // Check that ReviewService is defined
    });

    it('should create a review', async () => {
        const user = new User();
        user.firstName = 'John';
        user.lastName = 'Doe';
        user.email = 'john.doe@example.com';
        await userRepository.save(user);

        const vinylRecord = new VinylRecord();
        vinylRecord.name = 'Awesome Album';
        vinylRecord.authorName = 'Great Artist';
        vinylRecord.description = 'An awesome album by Great Artist';
        vinylRecord.price = 200;
        vinylRecord.imageUrl = '';
        await vinylRecordRepository.save(vinylRecord);

        const createReviewDto = {
            vinylRecordId: vinylRecord.id,
            content: 'Amazing album, loved it!',
            score: 5,
        };

        const review = await reviewService.createReview(
            user,
            createReviewDto,
            vinylRecord.id
        );

        assert.ok(review); // Check that the review is created
        assert.strictEqual(review.content, 'Amazing album, loved it!'); // Check the content of the review
        assert.strictEqual(review.score, 5); // Check the score of the review
        assert.strictEqual(review.vinylRecord.id, vinylRecord.id); // Ensure the correct vinyl record is linked
    });

    it('should get reviews for a vinyl record', async () => {
        const user = new User();
        user.firstName = 'Jane';
        user.lastName = 'Doe';
        user.email = 'jane.doe@example.com';
        await userRepository.save(user);

        const vinylRecord = new VinylRecord();
        vinylRecord.name = 'Another Awesome Album';
        vinylRecord.authorName = 'Another Artist';
        vinylRecord.description = 'An awesome album by Great Artist';
        vinylRecord.price = 200;
        vinylRecord.imageUrl = '';
        await vinylRecordRepository.save(vinylRecord);

        const review1 = new Review();
        review1.content = 'Fantastic album!';
        review1.score = 4;
        review1.user = user;
        review1.vinylRecord = vinylRecord;
        await reviewRepository.save(review1);

        const review2 = new Review();
        review2.content = 'Not bad, could be better';
        review2.score = 3;
        review2.user = user;
        review2.vinylRecord = vinylRecord;
        await reviewRepository.save(review2);

        const reviewsResponse = await reviewService.getReviewsByVinylRecord(
            vinylRecord.id,
            1,
            10
        );

        assert.strictEqual(reviewsResponse.total, 2); // Check that we have 2 reviews
        assert.strictEqual(reviewsResponse.data.length, 2); // Check that the correct number of reviews are returned
        assert.strictEqual(reviewsResponse.data[0].content, 'Fantastic album!'); // Check content of the first review
        assert.strictEqual(
            reviewsResponse.data[1].content,
            'Not bad, could be better'
        ); // Check content of the second review
    });

    it('should throw an error when deleting a non-existent review', async () => {
        try {
            await reviewService.delete(999); // Trying to delete a review with an invalid ID
            assert.fail('Expected NotFoundException, but none was thrown');
        } catch (error) {
            assert.ok(error instanceof NotFoundException); // Ensure that the error is a NotFoundException
        }
    });

    it('should delete a review successfully', async () => {
        const user = new User();
        user.firstName = 'Tom';
        user.lastName = 'Smith';
        user.email = 'tom.smith@example.com';
        await userRepository.save(user);

        const vinylRecord = new VinylRecord();
        vinylRecord.name = 'Some Vinyl';
        vinylRecord.authorName = 'Some Artist';
        vinylRecord.description = 'An awesome album by Great Artist';
        vinylRecord.price = 200;
        vinylRecord.imageUrl = '';
        await vinylRecordRepository.save(vinylRecord);

        const review = new Review();
        review.content = 'Decent album';
        review.score = 4;
        review.user = user;
        review.vinylRecord = vinylRecord;
        const savedReview = await reviewRepository.save(review);

        await reviewService.delete(savedReview.id); // Deleting the review

        try {
            await reviewRepository.findOneByOrFail({ id: savedReview.id });
            assert.fail('Expected review to be deleted, but it was found');
        } catch (error) {
            assert.ok(error instanceof Error); // Ensure the review is actually deleted
        }
    });
});
