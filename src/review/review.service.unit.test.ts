import { test } from 'node:test';
import assert from 'assert';
import sinon from 'sinon';
import { ReviewService } from './review.service';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';
import { User } from 'src/user/user.entity';
import { NotFoundException } from '@nestjs/common';

test('ReviewService - getReviewsByVinylRecord should return correct review data and pagination', async () => {
    // Arrange
    const reviewRepositoryMock = {
        findAndCount: sinon.stub(),
    };
    const vinylRecordRepositoryMock = {};
    const loggerMock = { log: sinon.stub() };

    const reviewService = new ReviewService(
    reviewRepositoryMock as any,
    vinylRecordRepositoryMock as any,
    loggerMock as any
    );

    const mockData = [{ id: 1, review: 'Great album!' }];
    const mockTotal = 5;
    reviewRepositoryMock.findAndCount.resolves([mockData, mockTotal]);

    const vinylRecordId = 1;
    const page = 1;
    const limit = 2;

    // Act
    const result = await reviewService.getReviewsByVinylRecord(
        vinylRecordId,
        page,
        limit
    );

    // Assert
    assert.deepEqual(result.data, mockData);
    assert.strictEqual(result.total, mockTotal);
    assert.strictEqual(result.currentPage, page);
    assert.strictEqual(result.totalPages, 3); // 5 total reviews, 2 per page
});

test('ReviewService - createReview should create a review successfully', async () => {
    // Arrange
    const reviewRepositoryMock = {
        create: sinon.stub(),
        save: sinon.stub(),
    };
    const vinylRecordRepositoryMock = {
        findOne: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const reviewService = new ReviewService(
    reviewRepositoryMock as any,
    vinylRecordRepositoryMock as any,
    loggerMock as any
    );

    const userMock = { id: 1, name: 'User' } as unknown as User;
    const createReviewDtoMock = {
        vinylRecordId: 1,
        content: 'Amazing album!',
        score: 5,
    };

    const mockVinylRecord = { id: 1, title: 'Album' } as unknown as VinylRecord;
    vinylRecordRepositoryMock.findOne.resolves(mockVinylRecord);

    const mockReview = {
        id: 1,
        user: userMock,
        vinylRecord: mockVinylRecord,
        content: 'Amazing album!',
        score: 5,
    };

    reviewRepositoryMock.create.returns(mockReview);
    reviewRepositoryMock.save.resolves(mockReview);

    // Act
    const result = await reviewService.createReview(
        userMock,
        createReviewDtoMock
    );

    // Assert
    assert.deepEqual(result, mockReview);
    assert.strictEqual(reviewRepositoryMock.create.callCount, 1);
    assert.strictEqual(reviewRepositoryMock.save.callCount, 2); // save is called twice: once for creation, once for saving
    assert.strictEqual(loggerMock.log.callCount, 1); // logger should log once
    assert.strictEqual(
        loggerMock.log.firstCall.args[0],
        'Review with id 1 created for vinyl record: 1'
    );
});

test('ReviewService - createReview should throw error if vinyl record not found', async () => {
    // Arrange
    const reviewRepositoryMock = {
        create: sinon.stub(),
        save: sinon.stub(),
    };
    const vinylRecordRepositoryMock = {
        findOne: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const reviewService = new ReviewService(
    reviewRepositoryMock as any,
    vinylRecordRepositoryMock as any,
    loggerMock as any
    );

    const userMock = { id: 1, name: 'User' } as unknown as User;
    const createReviewDtoMock = {
        vinylRecordId: 1,
        content: 'Amazing album!',
        score: 5,
    };

    vinylRecordRepositoryMock.findOne.resolves(null); // Mock that the vinyl record was not found

    // Act & Assert
    await assert.rejects(
        async () => await reviewService.createReview(userMock, createReviewDtoMock),
        { message: 'Vinyl record not found' }
    );
});

test('ReviewService - delete should delete review successfully', async () => {
    // Arrange
    const reviewRepositoryMock = {
        delete: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const reviewService = new ReviewService(
    reviewRepositoryMock as any,
    {} as any,
    loggerMock as any
    );

    const reviewId = 1;
    reviewRepositoryMock.delete.resolves({ affected: 1 }); // Simulate successful deletion

    // Act
    await reviewService.delete(reviewId);

    // Assert
    assert.strictEqual(reviewRepositoryMock.delete.callCount, 1);
    assert.strictEqual(reviewRepositoryMock.delete.firstCall.args[0], reviewId);
    assert.strictEqual(loggerMock.log.callCount, 1);
    assert.strictEqual(
        loggerMock.log.firstCall.args[0],
        `Review with id ${reviewId} deleted`
    );
});

test('ReviewService - delete should throw NotFoundException if review not found', async () => {
    // Arrange
    const reviewRepositoryMock = {
        delete: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const reviewService = new ReviewService(
    reviewRepositoryMock as any,
    {} as any,
    loggerMock as any
    );

    const reviewId = 1;
    reviewRepositoryMock.delete.resolves({ affected: 0 }); // Simulate that no rows were affected

    // Act & Assert
    await assert.rejects(
        async () => await reviewService.delete(reviewId),
        (error) => {
            // Check that the error is an instance of NotFoundException and has the correct message
            return (
                error instanceof NotFoundException &&
        error.message === 'Review not found'
            );
        }
    );
});
