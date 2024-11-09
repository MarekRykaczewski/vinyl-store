import { test } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { UserController } from './user.controller';
import { Request } from 'express';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

// Mock the UserService and the Request
const mockUserService = {
    findOneById: sinon.stub(),
    updateProfile: sinon.stub(),
    deleteProfile: sinon.stub(),
    getUserReviews: sinon.stub(),
    getUserPurchases: sinon.stub(),
};

const mockRequest = (user: any) =>
  ({
      user: user,
  }) as Request;

test('UserController - getProfile', async () => {
    // Arrange
    const userId = 1;
    const userProfile = { id: userId, firstName: 'John' };
    const userService = new UserController(mockUserService as any);
    mockUserService.findOneById.resolves(userProfile);

    const req = mockRequest(userProfile);

    // Act
    const result = await userService.getProfile(req as any);

    // Assert
    assert.strictEqual(result.id, userId);
    assert.strictEqual(result.firstName, 'John');
    assert(mockUserService.findOneById.calledWith(userId));
});

test('UserController - updateProfile', async () => {
    // Arrange
    const userId = 1;
    const updateUserProfileDto: UpdateUserProfileDto = {
        firstName: 'Updated Name',
    };
    const updatedProfile = { id: userId, firstName: 'Updated Name' };
    const userService = new UserController(mockUserService as any);
    mockUserService.updateProfile.resolves(updatedProfile);

    const req = mockRequest({ id: userId });

    // Act
    const result = await userService.updateProfile(
    req as any,
    updateUserProfileDto
    );

    // Assert
    assert.strictEqual(result.firstName, 'Updated Name');
    assert(
        mockUserService.updateProfile.calledWith(userId, updateUserProfileDto)
    );
});

test('UserController - deleteProfile', async () => {
    // Arrange
    const userId = 1;
    const userService = new UserController(mockUserService as any);
    mockUserService.deleteProfile.resolves();

    const req = mockRequest({ id: userId });

    // Act
    const result = await userService.deleteProfile(req as any);

    // Assert
    assert.deepStrictEqual(result, { message: 'Profile deleted successfully' });
    assert(mockUserService.deleteProfile.calledWith(userId));
});

test('UserController - getUserReviews', async () => {
    // Arrange
    const userId = 1;
    const reviews = [{ id: 1, review: 'Great product!' }];
    const userService = new UserController(mockUserService as any);
    mockUserService.getUserReviews.resolves(reviews);

    const req = mockRequest({ id: userId });

    // Act
    const result = await userService.getUserReviews(req as any);

    // Assert
    assert.deepStrictEqual(result, reviews);
    assert(mockUserService.getUserReviews.calledWith(userId));
});

test('UserController - getUserPurchases', async () => {
    // Arrange
    const userId = 1;
    const purchases = [{ id: 1, item: 'Laptop', price: 1200 }];
    const userService = new UserController(mockUserService as any);
    mockUserService.getUserPurchases.resolves(purchases);

    const req = mockRequest({ id: userId });

    // Act
    const result = await userService.getUserPurchases(req as any);

    // Assert
    assert.deepStrictEqual(result, purchases);
    assert(mockUserService.getUserPurchases.calledWith(userId));
});
