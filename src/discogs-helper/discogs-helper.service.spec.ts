import { Test, TestingModule } from '@nestjs/testing';
import { DiscogsService } from './discogs-helper.service';

describe('DiscogsHelperService', () => {
    let service: DiscogsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DiscogsService],
        }).compile();

        service = module.get<DiscogsService>(DiscogsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
