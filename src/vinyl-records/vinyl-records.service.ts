import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VinylRecord } from './entities/vinyl-record.entity';
import { VinylRecordDto } from './dto/vinyl-records.dto';
import { CreateVinylRecordDto } from './dto/create-vinyl-record.dto';
import { UpdateVinylRecordDto } from './dto/update-vinyl-record.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Injectable()
export class VinylRecordsService {
    constructor(
    @InjectRepository(VinylRecord)
    private readonly vinylRecordRepository: Repository<VinylRecord>,
    private readonly logger: WinstonLoggerService
    ) {}

    async findOne(id: number): Promise<VinylRecord> {
        const record = await this.vinylRecordRepository.findOne({ where: { id } });
        if (!record) {
            throw new NotFoundException(`Vinyl record with ID ${id} not found`);
        }
        return record;
    }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
    async getVinylRecords(
        page: number,
        limit: number
    ): Promise<{ data: VinylRecordDto[]; total: number }> {
        const offset = (page - 1) * limit;

        const records = await this.vinylRecordRepository.query(
            `
            SELECT 
                vr.id,
                vr.name,
                vr.authorName,
                vr.description,
                vr.price,
                vr.imageUrl,
                vr.createdAt,
                AVG(r.score) AS averageScore,
                -- Subquery to fetch the first review
                (SELECT JSON_OBJECT(
                    'id', r2.id,
                    'content', r2.content,
                    'score', r2.score,
                    'createdAt', r2.createdAt,
                    'userId', r2.userId
                ) 
                FROM reviews r2 
                WHERE r2.vinylRecordId = vr.id 
                ORDER BY r2.createdAt ASC
                LIMIT 1) AS firstReview
            FROM vinyl_records vr
            LEFT JOIN reviews r ON r.vinylRecordId = vr.id
            GROUP BY vr.id
            ORDER BY vr.createdAt DESC
            LIMIT ? OFFSET ?
            `,
            [limit, offset]
        );

        const totalResult = await this.vinylRecordRepository.query(
            'SELECT COUNT(*) as total FROM vinyl_records'
        );
        const total = parseInt(totalResult[0].total, 10);

        // Map SQL results to DTOs
        const data = records.map((record) => ({
            id: record.id,
            name: record.name,
            authorName: record.authorName,
            description: record.description,
            price: record.price,
            imageUrl: record.imageUrl,
            createdAt: record.createdAt,
            averageScore: parseFloat(record.averageScore) || null,
            firstReview: record.firstReview || null,
        }));

        return { data, total };
    }

  async searchAndSortVinylRecords(
      searchTerm: string,
      sortBy: 'price' | 'name' | 'authorName',
      order: 'ASC' | 'DESC',
      page: number,
      limit: number
  ) {
      const query = this.vinylRecordRepository.createQueryBuilder('vinylRecord');

      // Filter by search term if provided
      if (searchTerm) {
          query.where(
              'vinylRecord.name LIKE :searchTerm OR vinylRecord.authorName LIKE :searchTerm',
              { searchTerm: `%${searchTerm}%` }
          );
      }

      // Apply sorting
      if (sortBy) {
          query.orderBy(`vinylRecord.${sortBy}`, order);
      }

      // Pagination
      const offset = (page - 1) * limit;
      query.skip(offset).take(limit);

      // Execute query and get total count for pagination
      const [data, total] = await query.getManyAndCount();
      const totalPages = Math.ceil(total / limit);

      return {
          data,
          total,
          currentPage: page,
          totalPages,
      };
  }

  async create(
      createVinylRecordDto: CreateVinylRecordDto
  ): Promise<VinylRecord> {
      const vinylRecord = this.vinylRecordRepository.create(createVinylRecordDto);
      this.logger.log(
          `Vinyl Record with id ${vinylRecord.id} created: ${vinylRecord.name} - ${vinylRecord.authorName}`
      );
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
      this.logger.log(`Vinyl Record updated: ${id}`);
      return updatedRecord;
  }

  async delete(id: number): Promise<void> {
      const result = await this.vinylRecordRepository.delete(id);
      if (result.affected === 0) {
          throw new NotFoundException(`Record with ID ${id} not found`);
      }
      this.logger.log(`Vinyl Record deleted: ${id}`);
  }
}
