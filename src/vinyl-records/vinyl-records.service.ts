import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VinylRecord } from './entities/vinyl-record.entity';
import { VinylRecordDto } from './dto/vinyl-records.dto';
import { CreateVinylRecordDto } from './dto/create-vinyl-record.dto';
import { UpdateVinylRecordDto } from './dto/update-vinyl-record.dto';

@Injectable()
export class VinylRecordsService {
    constructor(
    @InjectRepository(VinylRecord)
    private readonly vinylRecordRepository: Repository<VinylRecord>
    ) {}

    // TODO: First Review and Average Score
    async getVinylRecords(
        page: number,
        limit: number
    ): Promise<{ data: VinylRecordDto[]; total: number }> {
        const [records, total] = await this.vinylRecordRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        // Map entities to DTOs
        const data = records.map((record) => ({
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

    async create(
        createVinylRecordDto: CreateVinylRecordDto
    ): Promise<VinylRecord> {
        const vinylRecord = this.vinylRecordRepository.create(createVinylRecordDto);
        return this.vinylRecordRepository.save(vinylRecord);
    }

    async update(
        id: number,
        updateVinylRecordDto: UpdateVinylRecordDto
    ): Promise<VinylRecord> {
        await this.vinylRecordRepository.update(id, updateVinylRecordDto);
        const updatedRecord = await this.vinylRecordRepository.findOne({
            where: { id },
        });
        if (!updatedRecord)
            throw new NotFoundException(`Record with ID ${id} not found`);
        return updatedRecord;
    }

    async delete(id: number): Promise<void> {
        const result = await this.vinylRecordRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Record with ID ${id} not found`);
        }
    }
}
