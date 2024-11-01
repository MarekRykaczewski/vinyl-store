import { DiscogsService } from 'src/discogs-helper/discogs-helper.service';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRecords1730398272915 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const discogsService = new DiscogsService();
        const records = await discogsService.fetchRandomRecords(50);

        for (const record of records) {
            const vinylRecord = new VinylRecord();

            // Split the title to extract authorName and record title
            const [authorName, recordTitle] = record.title.split(' - ');
            vinylRecord.authorName = authorName?.trim() || 'Unknown';
            vinylRecord.name = recordTitle?.trim() || record.title; // Use full title if no separator is found

            vinylRecord.description =
        [record.genre?.join(', '), record.style?.join(', ')]
            .filter(Boolean)
            .join(' - ') || 'No description'; // Combine genre and style

            // Random price generation between 10 and 50, with two decimal places
            vinylRecord.price = parseFloat(
                (Math.random() * (50 - 10) + 10).toFixed(2)
            );

            vinylRecord.imageUrl = record.cover_image || '';

            // Save the vinyl record entry
            await queryRunner.manager.save(vinylRecord);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM vinyl_records');
    }
}
