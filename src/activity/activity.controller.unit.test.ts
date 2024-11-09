import { test } from 'node:test';
import assert from 'assert';
import sinon from 'sinon';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

const mockActivityService = () => ({
    readActivities: sinon.stub(),
});

const controllerSetup = () => {
    const service = mockActivityService();
    const controller = new ActivityController(
    service as unknown as ActivityService
    );
    return { service, controller };
};

test('ActivityController.getActivities: Should retrieve a list of all activities', async () => {
    const { service, controller } = controllerSetup();
    const mockActivities = [
        { id: 1, name: 'Activity 1' },
        { id: 2, name: 'Activity 2' },
    ];

    service.readActivities.resolves(mockActivities);

    const result = await controller.getActivities();

    assert.deepStrictEqual(result, mockActivities);
    sinon.assert.calledOnce(service.readActivities);
});

test('ActivityController.getActivities: Should handle empty activity list', async () => {
    const { service, controller } = controllerSetup();
    const mockActivities = [];

    service.readActivities.resolves(mockActivities);

    const result = await controller.getActivities();

    assert.deepStrictEqual(result, mockActivities);
    sinon.assert.calledOnce(service.readActivities);
});

test('ActivityController.getActivities: Should throw error if service fails', async () => {
    const { service, controller } = controllerSetup();

    service.readActivities.rejects(new Error('Service failure'));

    await assert.rejects(() => controller.getActivities(), /Service failure/);
    sinon.assert.calledOnce(service.readActivities);
});
