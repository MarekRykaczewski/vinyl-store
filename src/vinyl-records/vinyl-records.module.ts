import { Module } from '@nestjs/common';
import { VinylRecordsService } from './vinyl-records.service';
import { VinylRecordsController } from './vinyl-records.controller';

@Module({
    providers: [VinylRecordsService],
    controllers: [VinylRecordsController]
})
export class VinylRecordsModule {}
