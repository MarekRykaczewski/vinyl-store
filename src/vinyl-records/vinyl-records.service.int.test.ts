import { TestingModule, Test } from '@nestjs/testing';
import { VinylRecordsService } from './vinyl-records.service';
import { VinylRecord } from './entities/vinyl-record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as assert from 'assert';
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/user.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';

describe('VinylRecordsService', () => {
    let vinylRecordsService: VinylRecordsService;
    let vinylRecordRepository: Repository<VinylRecord>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [VinylRecord, Review, User, Purchase],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([VinylRecord]),
            ],
            providers: [VinylRecordsService],
        }).compile();

        vinylRecordsService = module.get<VinylRecordsService>(VinylRecordsService);
        vinylRecordRepository = module.get<Repository<VinylRecord>>(
            getRepositoryToken(VinylRecord)
        );
    });

    afterEach(async () => {
        await vinylRecordRepository.query('DELETE FROM vinyl_records');
    });

    it('should be defined', () => {
        assert.ok(vinylRecordsService);
    });

    it('should create a vinyl record', async () => {
        const createVinylRecordDto = {
            name: 'Test Vinyl',
            authorName: 'Test Artist',
            description: 'A test vinyl record',
            price: 10,
            imageUrl: 'http://example.com/image.jpg',
        };

        const record = await vinylRecordsService.create(createVinylRecordDto);

        assert.strictEqual(record.name, createVinylRecordDto.name);
        assert.strictEqual(record.authorName, createVinylRecordDto.authorName);
        assert.strictEqual(record.price, createVinylRecordDto.price);
    });

    it('should throw conflict exception when creating a duplicate record', async () => {
        const createVinylRecordDto = {
            name: 'Test Vinyl',
            authorName: 'Test Artist',
            description: 'A test vinyl record',
            price: 10,
            imageUrl: 'http://example.com/image.jpg',
        };

        await vinylRecordsService.create(createVinylRecordDto);

        try {
            await vinylRecordsService.create(createVinylRecordDto);
        } catch (error) {
            assert.ok(error instanceof ConflictException);
        }
    });

    it('should return a vinyl record by ID', async () => {
        const createVinylRecordDto = {
            name: 'Test Vinyl',
            authorName: 'Test Artist',
            description: 'A test vinyl record',
            price: 10,
            imageUrl: 'http://example.com/image.jpg',
        };

        const record = await vinylRecordsService.create(createVinylRecordDto);
        const foundRecord = await vinylRecordsService.findOne(record.id);

        assert.strictEqual(foundRecord.id, record.id);
        assert.strictEqual(foundRecord.name, record.name);
    });

    it('should throw NotFoundException when record is not found by ID', async () => {
        try {
            await vinylRecordsService.findOne(999);
        } catch (error) {
            assert.ok(error instanceof NotFoundException);
        }
    });

    it('should return a list of vinyl records', async () => {
        const createVinylRecordDto1 = {
            name: 'Test Vinyl 1',
            authorName: 'Test Artist 1',
            description: 'A test vinyl record',
            price: 15,
            imageUrl: 'http://example.com/image1.jpg',
        };

        const createVinylRecordDto2 = {
            name: 'Test Vinyl 2',
            authorName: 'Test Artist 2',
            description: 'Another test vinyl record',
            price: 20,
            imageUrl: 'http://example.com/image2.jpg',
        };

        await vinylRecordsService.create(createVinylRecordDto1);
        await vinylRecordsService.create(createVinylRecordDto2);

        const result = await vinylRecordsService.getVinylRecords(1, 10);

        assert.strictEqual(result.data.length, 2);
        assert.strictEqual(result.total, 2);
    });

    it('should throw BadRequestException for invalid page or limit', async () => {
        try {
            await vinylRecordsService.getVinylRecords(-1, 10);
        } catch (error) {
            assert.ok(error instanceof BadRequestException);
        }
    });

    // New tests for update and delete

    it('should update a vinyl record by ID', async () => {
        const createVinylRecordDto = {
            name: 'Test Vinyl',
            authorName: 'Test Artist',
            description: 'A test vinyl record',
            price: 10,
            imageUrl: 'http://example.com/image.jpg',
        };

        const record = await vinylRecordsService.create(createVinylRecordDto);

        const updateVinylRecordDto = {
            name: 'Updated Vinyl',
            authorName: 'Updated Artist',
            description: 'Updated description',
            price: 20,
            imageUrl: 'http://example.com/updated-image.jpg',
        };

        const updatedRecord = await vinylRecordsService.update(
            record.id,
            updateVinylRecordDto
        );

        assert.strictEqual(updatedRecord.name, updateVinylRecordDto.name);
        assert.strictEqual(
            updatedRecord.authorName,
            updateVinylRecordDto.authorName
        );
        assert.strictEqual(updatedRecord.price, updateVinylRecordDto.price);
    });

    it('should throw NotFoundException when updating a non-existent vinyl record', async () => {
        const updateVinylRecordDto = {
            name: 'Non-existent Vinyl',
            authorName: 'Non-existent Artist',
            description: 'Non-existent description',
            price: 20,
            imageUrl: 'http://example.com/non-existent-image.jpg',
        };

        try {
            await vinylRecordsService.update(999, updateVinylRecordDto);
        } catch (error) {
            assert.ok(error instanceof NotFoundException);
        }
    });

    it('should delete a vinyl record by ID', async () => {
        const createVinylRecordDto = {
            name: 'Test Vinyl',
            authorName: 'Test Artist',
            description: 'A test vinyl record',
            price: 10,
            imageUrl: 'http://example.com/image.jpg',
        };

        const record = await vinylRecordsService.create(createVinylRecordDto);
        await vinylRecordsService.delete(record.id);

        try {
            await vinylRecordsService.findOne(record.id);
        } catch (error) {
            assert.ok(error instanceof NotFoundException);
        }
    });

    it('should throw NotFoundException when deleting a non-existent vinyl record', async () => {
        try {
            await vinylRecordsService.delete(999);
        } catch (error) {
            assert.ok(error instanceof NotFoundException);
        }
    });
});
