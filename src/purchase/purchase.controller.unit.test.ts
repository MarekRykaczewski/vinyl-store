import { test } from 'node:test';
import assert from 'assert';
import sinon from 'sinon';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

const mockPurchaseService = () => ({
    createCheckoutSession: sinon.stub(),
    verifyWebhookSignature: sinon.stub(),
    handleCheckoutSessionCompleted: sinon.stub(),
});

const controllerSetup = () => {
    const service = mockPurchaseService();
    const controller = new PurchaseController(
    service as unknown as PurchaseService
    );
    return { service, controller };
};

test('PurchaseController.initiatePurchase: Should initiate a Stripe checkout session', async () => {
    const { service, controller } = controllerSetup();
    const mockCheckoutUrl = 'https://checkout.stripe.com/somecheckouturl';
    const req = {
        user: { email: 'user@example.com' },
    } as unknown as Request;
    const res = {
        json: sinon.stub(),
    } as unknown as Response;

    service.createCheckoutSession.resolves(mockCheckoutUrl);

    await controller.initiatePurchase(1, req, res);

    // Ensure the service was called with the correct parameters
    sinon.assert.calledWith(service.createCheckoutSession, 1, 'user@example.com');
    // Ensure the response contains the correct checkout URL
    sinon.assert.calledWith(res.json as any, { checkoutUrl: mockCheckoutUrl });
});

test('PurchaseController.initiatePurchase: Should throw HttpException if service fails', async () => {
    const { service, controller } = controllerSetup();
    const req = { user: { email: 'user@example.com' } } as unknown as Request;
    const res = { json: sinon.stub() } as unknown as Response;

    service.createCheckoutSession.rejects(new Error('Internal error'));

    await assert.rejects(
        () => controller.initiatePurchase(1, req, res),
        (err) => err instanceof HttpException && err.getStatus() === 500
    );
});

test('PurchaseController.success: Should send success message', async () => {
    const { controller } = controllerSetup();
    const req = {} as unknown as Request;
    const res = { send: sinon.stub() } as unknown as Response;

    await controller.success(req, res);

    // Ensure the success message is sent
    sinon.assert.calledWith(
    res.send as any,
    'Payment was successful! Thank you for your purchase.'
    );
});

test('PurchaseController.cancel: Should send cancellation message', async () => {
    const { controller } = controllerSetup();
    const req = {} as unknown as Request;
    const res = { send: sinon.stub() } as unknown as Response;

    await controller.cancel(req, res);

    // Ensure the cancellation message is sent
    sinon.assert.calledWith(res.send as any, 'Payment was canceled.');
});
