import { test } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { VinylRecordsService } from './vinyl-records.service';
import { Repository } from 'typeorm';
import { WinstonLoggerService } from 'src/logger/logger.service';

// Create a stub instance of Repository
const mockVinylRecordRepository = sinon.createStubInstance(Repository);

// Mock logger
class MockWinstonLoggerService {
    log = sinon.spy();
    error = sinon.spy();
    warn = sinon.spy();
    debug = sinon.spy();
}

const mockLogger =
  new MockWinstonLoggerService() as unknown as WinstonLoggerService;

// Creating an instance of the service with mocks
const vinylRecordsService = new VinylRecordsService(
    mockVinylRecordRepository,
    mockLogger
);

test('VinylRecordService - findOne - should throw NotFoundException when record does not exist', async () => {
    const recordId = 1;

    mockVinylRecordRepository.findOne.resolves(null);

    await assert.rejects(vinylRecordsService.findOne(recordId), {
        name: 'NotFoundException',
        message: `Vinyl record with ID ${recordId} not found`,
    });
});

test('VinylRecordService - searchAndSortVinylRecords - should throw BadRequestException when sortBy is invalid', async () => {
    await assert.rejects(
        vinylRecordsService.searchAndSortVinylRecords(
            'record',
      'invalidSortBy' as any,
      'ASC',
      1,
      10
        ),
        {
            name: 'BadRequestException',
            message: 'Invalid sortBy value: invalidSortBy',
        }
    );
});

test('VinylRecordService - searchAndSortVinylRecords - should throw BadRequestException when order is invalid', async () => {
    await assert.rejects(
        vinylRecordsService.searchAndSortVinylRecords(
            'record',
            'price',
      'INVALID' as any,
      1,
      10
        ),
        { name: 'BadRequestException', message: 'Invalid order value: INVALID' }
    );
});

test('VinylRecordService - create - should throw ConflictException when record with same name and author exists', async () => {
    const createDto = {
        name: 'Record 1',
        authorName: 'Author 1',
        price: 20,
        description: 'Desc',
        imageUrl: '',
    };

    // Mock findOne to resolve with an existing record (simulate conflict)
    mockVinylRecordRepository.findOne.resolves({
        id: 1,
        name: 'Record 1',
        authorName: 'Author 1',
        price: 20,
        description: 'Desc',
    });

    await assert.rejects(vinylRecordsService.create(createDto), {
        name: 'ConflictException',
        message: 'A vinyl record with this name and author already exists',
    });
});

test('VinylRecordService - create - should throw ConflictException when record with same name and author exists', async () => {
    const createDto = {
        name: 'Record 1',
        authorName: 'Author 1',
        price: 20,
        description: 'Desc',
        imageUrl: '',
    };

    // Mock findOne to resolve with an existing record (simulate conflict)
    mockVinylRecordRepository.findOne.resolves({
        id: 1,
        name: 'Record 1',
        authorName: 'Author 1',
        price: 20,
        description: 'Desc',
    });

    await assert.rejects(vinylRecordsService.create(createDto), {
        name: 'ConflictException',
        message: 'A vinyl record with this name and author already exists',
    });
});

test('VinylRecordService - update - should throw NotFoundException when record to update does not exist', async () => {
    const updateDto = { name: 'Updated Record' };
    const recordId = 1;

    mockVinylRecordRepository.findOne.resolves(null); // No record to update

    await assert.rejects(vinylRecordsService.update(recordId, updateDto), {
        name: 'NotFoundException',
        message: `Record with ID ${recordId} not found`,
    });
});

test('VinylRecordService - update - should update a vinyl record successfully', async () => {
    const updateDto = { name: 'Updated Record' };
    const recordId = 1;
    const existingRecord = { id: 1, name: 'Old Record' };

    mockVinylRecordRepository.findOne.resolves(existingRecord);
    mockVinylRecordRepository.merge.resolves({ ...existingRecord, ...updateDto });
    mockVinylRecordRepository.save.resolves({ ...existingRecord, ...updateDto });

    const result = await vinylRecordsService.update(recordId, updateDto);

    assert.deepStrictEqual(result, { ...existingRecord, ...updateDto });
});

test('VinylRecordService - delete - should throw NotFoundException when record to delete does not exist', async () => {
    const recordId = 1;

    mockVinylRecordRepository.delete.resolves({
        affected: 0,
        raw: undefined,
    }); // No record was deleted

    await assert.rejects(vinylRecordsService.delete(recordId), {
        name: 'NotFoundException',
        message: `Record with ID ${recordId} not found`,
    });
});

test('VinylRecordService - delete - should delete a vinyl record successfully', async () => {
    const recordId = 1;

    mockVinylRecordRepository.delete.resolves({
        affected: 1,
        raw: undefined,
    }); // Record was deleted

    await vinylRecordsService.delete(recordId);
});
