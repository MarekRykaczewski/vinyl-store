import { test } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { ReviewController } from './review.controller';
import { CreateReviewDto } from './dto/create-review.dto';
import { Request } from 'express';

// Mock ReviewService
const mockReviewService = {
    createReview: sinon.stub(),
    delete: sinon.stub(),
    getReviewsByVinylRecord: sinon.stub(),
};

const mockRequest = (user: any) =>
  ({
      user: user,
  }) as Request;

test('ReviewController - createReview', async () => {
    // Arrange
    const vinylRecordId = 1;
    const user = { id: 1, name: 'John Doe' };
    const createReviewDto: CreateReviewDto = {
        content: 'Great vinyl!',
        score: 5,
    };
    const mockResponse = {
        id: 1,
        content: 'Great vinyl!',
        rating: 5,
        vinylRecordId,
    };

    const reviewController = new ReviewController(mockReviewService as any);
    mockReviewService.createReview.resolves(mockResponse);

    const req = mockRequest(user);

    // Act
    const result = await reviewController.createReview(
        vinylRecordId,
        createReviewDto,
        req
    );

    // Assert
    assert.strictEqual(result.id, 1);
    assert.strictEqual(result.content, 'Great vinyl!');
    assert(mockReviewService.createReview.calledWith(user, createReviewDto));
});

test('ReviewController - getReviewsByVinylRecord', async () => {
    // Arrange
    const vinylRecordId = 1;
    const reviews = [
        { id: 1, content: 'Great vinyl!', rating: 5 },
        { id: 2, content: 'Not bad', rating: 3 },
    ];
    const page = 1;
    const limit = 2;

    const reviewController = new ReviewController(mockReviewService as any);
    mockReviewService.getReviewsByVinylRecord.resolves(reviews);

    // Act
    const result = await reviewController.getReviewsByVinylRecord(
        vinylRecordId,
        page,
        limit
    );

    // Assert
    assert.deepStrictEqual(result, reviews);
    assert(
        mockReviewService.getReviewsByVinylRecord.calledWith(
            vinylRecordId,
            page,
            limit
        )
    );
});

test('ReviewController - getReviewsByVinylRecord with invalid pagination', async () => {
    // Arrange
    const vinylRecordId = 1;
    const page = -1;
    const limit = 2;

    const reviewController = new ReviewController(mockReviewService as any);

    // Act & Assert
    try {
        await reviewController.getReviewsByVinylRecord(vinylRecordId, page, limit);
        assert.fail('Error was expected');
    } catch (error) {
        assert.strictEqual(error.message, 'Page and limit must be greater than 0');
    }
});
