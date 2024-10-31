import { Test, TestingModule } from '@nestjs/testing';
import { VinylRecordsController } from './vinyl-records.controller';

describe('VinylRecordsController', () => {
    let controller: VinylRecordsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VinylRecordsController],
        }).compile();

        controller = module.get<VinylRecordsController>(VinylRecordsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
