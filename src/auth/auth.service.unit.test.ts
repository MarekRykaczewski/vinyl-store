import { test } from 'node:test';
import assert from 'assert';
import sinon from 'sinon';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { User } from 'src/user/user.entity';

test('AuthService - validateOrCreateUser should return existing user if user is found', async () => {
    const mockProfile = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
    };

    // Mock UserService
    const findOneByEmailStub = sinon
        .stub(UserService.prototype, 'findOneByEmail')
        .resolves({
            id: 1,
            email: mockProfile.email,
            firstName: mockProfile.firstName,
            lastName: mockProfile.lastName,
            avatarUrl: '',
            birthdate: undefined,
            isAdmin: false,
            reviews: [],
            purchases: [],
        });

    const userService = new UserService(null, null, null, null);
    const authService = new AuthService(userService, null, null);

    const user = await authService.validateOrCreateUser(mockProfile);

    assert.strictEqual(user.email, mockProfile.email);
    assert.strictEqual(user.firstName, mockProfile.firstName);
    assert.strictEqual(user.lastName, mockProfile.lastName);

    findOneByEmailStub.restore();
});

test('AuthService - validateOrCreateUser should create new user if user not found', async () => {
    const mockProfile = {
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
    };

    // Mock UserService
    const findOneByEmailStub = sinon
        .stub(UserService.prototype, 'findOneByEmail')
        .resolves(null);
    const createStub = sinon.stub(UserService.prototype, 'create').resolves({
        id: 2,
        email: mockProfile.email,
        firstName: mockProfile.firstName,
        lastName: mockProfile.lastName,
        avatarUrl: '',
        birthdate: undefined,
        isAdmin: false,
        reviews: [],
        purchases: [],
    });

    // Mock Logger
    const loggerStub = sinon.stub(WinstonLoggerService.prototype, 'log');

    const userService = new UserService(null, null, null, null);
    const logger = new WinstonLoggerService();
    const authService = new AuthService(userService, null, logger);

    const user = await authService.validateOrCreateUser(mockProfile);

    assert.strictEqual(user.email, mockProfile.email);
    assert.strictEqual(user.firstName, mockProfile.firstName);
    assert.strictEqual(user.lastName, mockProfile.lastName);
    assert.ok(loggerStub.calledWith('User 2 created with email new@example.com'));

    findOneByEmailStub.restore();
    createStub.restore();
    loggerStub.restore();
});

test('AuthService - validateOrCreateUser should throw HttpException on error', async () => {
    const mockProfile = {
        email: 'error@example.com',
        firstName: 'Error',
        lastName: 'User',
    };

    // Mock UserService
    const findOneByEmailStub = sinon
        .stub(UserService.prototype, 'findOneByEmail')
        .rejects(new Error('Database error'));

    // Mock Logger
    const loggerStub = sinon.stub(WinstonLoggerService.prototype, 'error');

    const userService = new UserService(null, null, null, null);
    const logger = new WinstonLoggerService();
    const authService = new AuthService(userService, null, logger);

    try {
        await authService.validateOrCreateUser(mockProfile);
        assert.fail('Expected error to be thrown');
    } catch (error) {
        assert.ok(error instanceof HttpException);
        assert.strictEqual(error.getStatus(), HttpStatus.INTERNAL_SERVER_ERROR);

        // Modify assertion to check string error response
        assert.strictEqual(
            error.getResponse(),
            'Unable to validate or create user'
        );
        assert.ok(
            loggerStub.calledWith('Failed to validate or create user: Database error')
        );
    }

    findOneByEmailStub.restore();
    loggerStub.restore();
});

test('AuthService - generateJwt should generate JWT token', () => {
    const mockUser = { id: 1, email: 'test@example.com' };

    // Mock JwtService
    const signStub = sinon
        .stub(JwtService.prototype, 'sign')
        .returns('mock-jwt-token');

    const jwtService = new JwtService(null);
    const authService = new AuthService(null, jwtService, null);

    const token = authService.generateJwt(mockUser);

    assert.strictEqual(token, 'mock-jwt-token');
    signStub.restore();
});

test('AuthService - authenticateUser should return user and token', async () => {
    const mockProfile = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
    };
    const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: '',
        birthdate: undefined,
        isAdmin: false,
        reviews: [],
        purchases: [],
    };

    // Mock dependencies
    const validateOrCreateUserStub = sinon
        .stub(AuthService.prototype, 'validateOrCreateUser')
        .resolves(mockUser);
    const generateJwtStub = sinon
        .stub(AuthService.prototype, 'generateJwt')
        .returns('mock-jwt-token');

    const authService = new AuthService(null, null, null);

    const result = await authService.authenticateUser(mockProfile);

    assert.strictEqual(result.token, 'mock-jwt-token');
    assert.deepStrictEqual(result.user, mockUser);

    validateOrCreateUserStub.restore();
    generateJwtStub.restore();
});
