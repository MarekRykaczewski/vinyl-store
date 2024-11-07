import { Module } from '@nestjs/common';
import { VinylRecordsService } from './vinyl-records.service';
import { VinylRecordsController } from './vinyl-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylRecord } from './entities/vinyl-record.entity';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Module({
    imports: [TypeOrmModule.forFeature([VinylRecord])],
    providers: [VinylRecordsService, WinstonLoggerService],
    controllers: [VinylRecordsController],
    exports: [VinylRecordsService],
})
export class VinylRecordsModule {}
