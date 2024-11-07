import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Module({
    controllers: [ActivityController],
    providers: [ActivityService, WinstonLoggerService],
})
export class ActivityModule {}
