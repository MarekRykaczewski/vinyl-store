import { Test, TestingModule } from '@nestjs/testing';
import { VinylRecordsService } from './vinyl-records.service';

describe('VinylRecordsService', () => {
    let service: VinylRecordsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VinylRecordsService],
        }).compile();

        service = module.get<VinylRecordsService>(VinylRecordsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
