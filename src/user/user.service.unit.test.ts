import { test } from 'node:test';
import assert from 'assert';
import sinon from 'sinon';
import { UserService } from './user.service';

test('UserService - findAll should return all users', async () => {
    // Arrange
    const userRepositoryMock = {
        find: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const userService = new UserService(
    userRepositoryMock as any,
    {} as any,
    {} as any,
    loggerMock as any
    );

    const mockUsers = [{ id: 1, email: 'test@example.com' }];
    userRepositoryMock.find.resolves(mockUsers);

    // Act
    const result = await userService.findAll();

    // Assert
    assert.deepEqual(result, mockUsers);
    assert.strictEqual(userRepositoryMock.find.callCount, 1);
});

test('UserService - findOneByEmail should return user by email', async () => {
    // Arrange
    const userRepositoryMock = {
        findOne: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const userService = new UserService(
    userRepositoryMock as any,
    {} as any,
    {} as any,
    loggerMock as any
    );

    const mockUser = { id: 1, email: 'test@example.com' };
    userRepositoryMock.findOne.resolves(mockUser);

    // Act
    const result = await userService.findOneByEmail('test@example.com');

    // Assert
    assert.deepEqual(result, mockUser);
    assert.strictEqual(userRepositoryMock.findOne.callCount, 1);
});

test('UserService - findOneById should return user by id', async () => {
    // Arrange
    const userRepositoryMock = {
        findOne: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const userService = new UserService(
    userRepositoryMock as any,
    {} as any,
    {} as any,
    loggerMock as any
    );

    const mockUser = { id: 1, email: 'test@example.com' };
    userRepositoryMock.findOne.resolves(mockUser);

    // Act
    const result = await userService.findOneById(1);

    // Assert
    assert.deepEqual(result, mockUser);
    assert.strictEqual(userRepositoryMock.findOne.callCount, 1);
});

test('UserService - create should create and save a user', async () => {
    // Arrange
    const userRepositoryMock = {
        create: sinon.stub(),
        save: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const userService = new UserService(
    userRepositoryMock as any,
    {} as any,
    {} as any,
    loggerMock as any
    );

    const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
    };
    const mockUser = { ...userData, id: 1 };

    userRepositoryMock.create.returns(mockUser);
    userRepositoryMock.save.resolves(mockUser);

    // Act
    const result = await userService.create(userData);

    // Assert
    assert.deepEqual(result, mockUser);
    assert.strictEqual(userRepositoryMock.create.callCount, 1);
    assert.strictEqual(userRepositoryMock.save.callCount, 1);
    assert.strictEqual(loggerMock.log.callCount, 1);
});

test('UserService - updateProfile should update and save user', async () => {
    // Arrange
    const userRepositoryMock = {
        findOne: sinon.stub(),
        save: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const userService = new UserService(
    userRepositoryMock as any,
    {} as any,
    {} as any,
    loggerMock as any
    );

    const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
    };
    const updateData = { firstName: 'Updated' };
    const updatedUser = { ...mockUser, ...updateData };

    userRepositoryMock.findOne.resolves(mockUser);
    userRepositoryMock.save.resolves(updatedUser);

    // Act
    const result = await userService.updateProfile(1, updateData);

    // Assert
    assert.deepEqual(result, updatedUser);
    assert.strictEqual(userRepositoryMock.save.callCount, 1);
    assert.strictEqual(loggerMock.log.callCount, 1);
});

test('UserService - deleteProfile should delete user successfully', async () => {
    // Arrange
    const userRepositoryMock = {
        delete: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const userService = new UserService(
    userRepositoryMock as any,
    {} as any,
    {} as any,
    loggerMock as any
    );

    userRepositoryMock.delete.resolves({ affected: 1 });

    // Act
    await userService.deleteProfile(1);

    // Assert
    assert.strictEqual(userRepositoryMock.delete.callCount, 1);
    assert.strictEqual(loggerMock.log.callCount, 1);
});

test('UserService - getUserPurchases should return purchases for a user', async () => {
    // Arrange
    const purchaseRepositoryMock = {
        find: sinon.stub(),
    };
    const userRepositoryMock = {
        findOne: sinon.stub(),
    };
    const loggerMock = { log: sinon.stub() };

    const userService = new UserService(
    userRepositoryMock as any,
    {} as any,
    purchaseRepositoryMock as any,
    loggerMock as any
    );

    const mockUser = { id: 1, email: 'test@example.com' };
    const mockPurchases = [{ id: 1, purchaseDate: new Date() }];
    userRepositoryMock.findOne.resolves(mockUser);
    purchaseRepositoryMock.find.resolves(mockPurchases);

    // Act
    const result = await userService.getUserPurchases(1);

    // Assert
    assert.deepEqual(result, mockPurchases);
    assert.strictEqual(purchaseRepositoryMock.find.callCount, 1);
});
