import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { VinylRecordsModule } from 'src/vinyl-records/vinyl-records.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Purchase]),
        UserModule,
        VinylRecordsModule,
        ConfigModule,
    ],
    providers: [PurchaseService, WinstonLoggerService],
    controllers: [PurchaseController],
})
export class PurchaseModule {}
