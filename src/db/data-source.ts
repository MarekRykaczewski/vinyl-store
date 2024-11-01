import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { Review } from 'src/review/entities/review.entity';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';
import { DataSource } from 'typeorm';

ConfigModule.forRoot({
    envFilePath: [
        `.env.${process.env.NODE_ENV}`, // Use .env.test when NODE_ENV is set to 'test'
        '.env', // Fallback to .env
    ],
    isGlobal: true,
});

const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [VinylRecord, User, Review],
    migrations: ['src/db/migrations/*.ts'],
    synchronize: false, // Make sure this is false for production
});
