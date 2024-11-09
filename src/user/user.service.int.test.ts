import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { Review } from 'src/review/entities/review.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { describe, it, beforeEach } from 'node:test';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';
import * as assert from 'node:assert';

describe('UserService', () => {
    let userService: UserService;
    let reviewRepository: Repository<Review>;
    let purchaseRepository: Repository<Purchase>;
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
                TypeOrmModule.forFeature([VinylRecord, User, Review, Purchase]), // Importing the repositories needed
            ],
            providers: [UserService, WinstonLoggerService],
        }).compile();

        userService = module.get<UserService>(UserService);
        reviewRepository = module.get<Repository<Review>>(
            getRepositoryToken(Review)
        );
        purchaseRepository = module.get<Repository<Purchase>>(
            getRepositoryToken(Purchase)
        );
        dataSource = module.get<DataSource>(DataSource);
    });

    beforeEach(async () => {
    // Reset the database before each test
        await dataSource.synchronize(true);
    });

    it('should be defined', () => {
        assert.ok(userService); // Checks that userService is defined
    });

    it('should create a user', async () => {
        const user = await userService.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
        });

        assert.ok(user); // Assert user is defined
        assert.strictEqual(user.firstName, 'John'); // Assert firstName is 'John'
        assert.strictEqual(user.lastName, 'Doe'); // Assert lastName is 'Doe'
        assert.strictEqual(user.email, 'john.doe@example.com'); // Assert email is 'john.doe@example.com'
    });

    it('should find a user by ID', async () => {
        const user = await userService.create({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
        });

        const foundUser = await userService.findOneById(user.id);
        assert.ok(foundUser); // Assert foundUser is defined
        assert.strictEqual(foundUser.id, user.id); // Assert IDs are equal
    });

    it('should throw an error if user not found by ID', async () => {
        try {
            await userService.findOneById(999);
            assert.fail('Expected NotFoundException, but none was thrown');
        } catch (error) {
            assert.ok(error instanceof NotFoundException); // Assert that error is an instance of NotFoundException
        }
    });

    it('should update a user profile', async () => {
        const user = await userService.create({
            firstName: 'Alice',
            lastName: 'Williams',
            email: 'alice.williams@example.com',
        });

        const updatedUser = await userService.updateProfile(user.id, {
            firstName: 'Alicia',
            lastName: 'Williams',
        });

        assert.strictEqual(updatedUser.firstName, 'Alicia'); // Assert firstName is updated to 'Alicia'
        assert.strictEqual(updatedUser.lastName, 'Williams'); // Assert lastName remains 'Williams'
    });

    it('should delete a user profile', async () => {
        const user = await userService.create({
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com',
        });

        await userService.deleteProfile(user.id);
        try {
            await userService.findOneById(user.id);
            assert.fail('Expected NotFoundException, but none was thrown');
        } catch (error) {
            assert.ok(error instanceof NotFoundException); // Assert that error is an instance of NotFoundException
        }
    });

    it('should get a user\'s reviews', async () => {
        const user = await userService.create({
            firstName: 'Charlie',
            lastName: 'Brown',
            email: 'charlie.brown@example.com',
        });

        // Create and save a VinylRecord instance with required fields
        const vinylRecord = new VinylRecord();
        vinylRecord.name = 'Sample Album';
        vinylRecord.authorName = 'Sample Author'; // Provide a value for authorName
        vinylRecord.description = 'Sample description'; // Add other required fields as necessary
        vinylRecord.price = 20.0; // Set a price value if required
        vinylRecord.imageUrl = '';
        await dataSource.getRepository(VinylRecord).save(vinylRecord);

        const review = new Review();
        review.user = user;
        review.vinylRecord = vinylRecord; // Associate the vinylRecord with the review
        review.content = 'Great product!';
        review.score = 5;
        await reviewRepository.save(review);

        const reviews = await userService.getUserReviews(user.id);
        assert.strictEqual(reviews.length, 1); // Assert that there is one review
        assert.strictEqual(reviews[0].content, 'Great product!'); // Assert the review content is 'Great product!'
        assert.strictEqual(reviews[0].score, 5);
        assert.strictEqual(reviews[0].vinylRecordId, vinylRecord.id); // Ensure vinylRecordId is set correctly
    });

    it('should get a user\'s purchases', async () => {
        const user = await userService.create({
            firstName: 'Diana',
            lastName: 'Taylor',
            email: 'diana.taylor@example.com',
        });

        const purchase = new Purchase();
        purchase.user = user;
        await purchaseRepository.save(purchase);

        const purchases = await userService.getUserPurchases(user.id);
        assert.strictEqual(purchases.length, 1); // Assert that there is one purchase
    });
});
