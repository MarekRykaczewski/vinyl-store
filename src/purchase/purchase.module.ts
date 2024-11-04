import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { VinylRecordsModule } from 'src/vinyl-records/vinyl-records.module';

@Module({
    imports: [VinylRecordsModule],
    providers: [PurchaseService],
    controllers: [PurchaseController],
})
export class PurchaseModule {}
