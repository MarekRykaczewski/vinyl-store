import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import sinon from 'sinon';
import { AuthController } from './auth.controller';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

// Mocking AuthService
const mockAuthService = sinon.createStubInstance(AuthService);

test('googleAuthRedirect should authenticate and return JWT', async () => {
    const req = {
        user: { email: 'user@example.com', firstName: 'John', lastName: 'Doe' },
    };
    const res = {
        cookie: sinon.stub(),
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    // Mock the AuthService methods
    mockAuthService.validateOrCreateUser.resolves({
        id: 1,
        email: 'user@example.com',
        firstName: '',
        lastName: '',
        avatarUrl: '',
        birthdate: undefined,
        isAdmin: false,
        reviews: [],
        purchases: [],
    });
    mockAuthService.generateJwt.returns('jwt_token');

    const controller = new AuthController(mockAuthService);

    // Execute the method
    await controller.googleAuthRedirect(req as any, res as any);

    // Assert that the user was validated or created
    assert.ok(
        mockAuthService.validateOrCreateUser.calledOnce,
        'validateOrCreateUser should be called once'
    );

    // Assert that JWT was generated
    assert.ok(
        mockAuthService.generateJwt.calledOnce,
        'generateJwt should be called once'
    );

    // Assert that cookie method was called with jwt
    assert.ok(
        res.cookie.calledWith('jwt', 'jwt_token'),
        'JWT should be set in the cookie'
    );

    // Assert that response status is 200
    assert.ok(res.status.calledWith(200), 'Response status should be 200');

    // Assert that response json method was called with the token
    assert.ok(
        res.json.calledWith({ token: 'jwt_token' }),
        'Response should return the JWT'
    );

    // Clean up
    mockAuthService.validateOrCreateUser.reset();
    mockAuthService.generateJwt.reset();
});

test('googleAuthRedirect should throw error when user is not authenticated', async () => {
    const req = { user: null }; // No user in the request
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    // Mock the AuthService methods
    const controller = new AuthController(mockAuthService);

    // Execute the method and assert that it throws an exception
    try {
        await controller.googleAuthRedirect(req as any, res as any);
    } catch (e) {
        assert.strictEqual(
            e instanceof HttpException,
            true,
            'Should throw an HttpException'
        );
        assert.strictEqual(
            e.getStatus(),
            HttpStatus.UNAUTHORIZED,
            'Should return status 401'
        );
    }

    // Clean up
    mockAuthService.validateOrCreateUser.reset();
    mockAuthService.generateJwt.reset();
});

test('logout should clear JWT cookie', async () => {
    const res = { cookie: sinon.stub(), send: sinon.stub() };

    const controller = new AuthController(mockAuthService);

    // Execute the method
    controller.logout(res as any);

    // Assert that the cookie was cleared by setting an empty value
    assert.ok(
        res.cookie.calledWith('jwt', '', { httpOnly: true, expires: new Date(0) }),
        'JWT cookie should be cleared'
    );

    // Assert that response send was called
    assert.ok(
        res.send.calledWith({ message: 'Logged out successfully' }),
        'Response should confirm logout'
    );
});
