import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VinylRecord } from './entities/vinyl-record.entity';
import { VinylRecordDto } from './dto/vinyl-records.dto';

@Injectable()
export class VinylRecordsService {
    constructor(
        @InjectRepository(VinylRecord)
        private readonly vinylRecordRepository: Repository<VinylRecord>,
    ) {}

    // TODO: First Review and Average Score
    async getVinylRecords(page: number, limit: number): Promise<{ data: VinylRecordDto[]; total: number; }> {
        const [records, total] = await this.vinylRecordRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        // Map entities to DTOs
        const data = records.map(record => ({
            id: record.id,
            name: record.name,
            authorName: record.authorName,
            description: record.description,
            price: record.price,
            imageUrl: record.imageUrl,
            createdAt: record.createdAt,
        }));

        return { data, total };
    }
}
