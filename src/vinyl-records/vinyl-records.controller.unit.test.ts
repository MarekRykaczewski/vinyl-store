import { test } from 'node:test';
import assert from 'assert';
import sinon from 'sinon';
import { VinylRecordsController } from './vinyl-records.controller';
import { VinylRecordsService } from './vinyl-records.service';
import { BadRequestException } from '@nestjs/common';

const mockVinylRecordsService = () => ({
    getVinylRecords: sinon.stub(),
    searchAndSortVinylRecords: sinon.stub(),
    create: sinon.stub(),
    update: sinon.stub(),
    delete: sinon.stub(),
});

const controllerSetup = () => {
    const service = mockVinylRecordsService();
    const controller = new VinylRecordsController(
    service as unknown as VinylRecordsService
    );
    return { service, controller };
};

// Test for the getVinylRecords method
test('VinylRecordsController.getVinylRecords: Should retrieve paginated records', async () => {
    const { service, controller } = controllerSetup();
    const mockData = { data: [{ id: 1, name: 'Vinyl 1' }], total: 1 };

    service.getVinylRecords.resolves(mockData);

    const result = await controller.getVinylRecords(1, 10);

    assert.deepStrictEqual(result, {
        data: mockData.data,
        total: 1,
        currentPage: 1,
        totalPages: 1,
    });
    sinon.assert.calledWith(service.getVinylRecords, 1, 10);
});

test('VinylRecordsController.getVinylRecords: Should throw BadRequestException if page or limit is <= 0', async () => {
    const { controller } = controllerSetup();

    await assert.rejects(
        () => controller.getVinylRecords(0, 10),
        BadRequestException
    );
    await assert.rejects(
        () => controller.getVinylRecords(1, 0),
        BadRequestException
    );
});

// Test for the searchVinylRecords method
test('VinylRecordsController.searchVinylRecords: Should search and sort records', async () => {
    const { service, controller } = controllerSetup();
    const mockData = { data: [{ id: 2, name: 'Vinyl 2' }], total: 1 };

    service.searchAndSortVinylRecords.resolves(mockData);

    const result = await controller.searchVinylRecords(
        'rock',
        'name',
        'ASC',
        1,
        10
    );

    assert.deepStrictEqual(result, mockData);
    sinon.assert.calledWith(
        service.searchAndSortVinylRecords,
        'rock',
        'name',
        'ASC',
        1,
        10
    );
});

// Test for the createVinylRecord method
test('VinylRecordsController.createVinylRecord: Should create a new vinyl record', async () => {
    const { service, controller } = controllerSetup();
    const newRecord = { name: 'New Vinyl' };
    const createdRecord = { id: 3, ...newRecord };

    service.create.resolves(createdRecord);

    const result = await controller.createVinylRecord(newRecord as any);

    assert.deepStrictEqual(result, createdRecord);
    sinon.assert.calledWith(service.create, newRecord);
});

// Test for the updateVinylRecord method
test('VinylRecordsController.updateVinylRecord: Should update a vinyl record by ID', async () => {
    const { service, controller } = controllerSetup();
    const updatedRecord = { id: 3, name: 'Updated Vinyl' };

    service.update.resolves(updatedRecord);

    const result = await controller.updateVinylRecord(3, {
        name: 'Updated Vinyl',
    } as any);

    assert.deepStrictEqual(result, updatedRecord);
    sinon.assert.calledWith(service.update, 3, { name: 'Updated Vinyl' });
});

// Test for the deleteVinylRecord method
test('VinylRecordsController.deleteVinylRecord: Should delete a vinyl record by ID', async () => {
    const { service, controller } = controllerSetup();
    const deletedRecord = { id: 3 };

    service.delete.resolves(deletedRecord);

    const result = await controller.deleteVinylRecord(3);

    assert.deepStrictEqual(result, deletedRecord);
    sinon.assert.calledWith(service.delete, 3);
});
