import { Module } from '@nestjs/common';
import { VinylRecordsService } from './vinyl-records.service';
import { VinylRecordsController } from './vinyl-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylRecord } from './entities/vinyl-record.entity';

@Module({
    imports: [TypeOrmModule.forFeature([VinylRecord])],
    providers: [VinylRecordsService],
    controllers: [VinylRecordsController],
})
export class VinylRecordsModule {}
