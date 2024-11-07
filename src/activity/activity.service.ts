import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Injectable()
export class ActivityService {
    constructor(private readonly winstonLogger: WinstonLoggerService) {}

    logActivity(action: string, entity: string, entityId: number) {
        const message = `${action} action performed on ${entity} with ID ${entityId}`;
        this.winstonLogger.log(message);
    }

    async readActivities() {
        const logFilePath = path.join(__dirname, '..', '..', 'logs', 'app.log');
        if (!fs.existsSync(logFilePath)) {
            throw new Error('Log file does not exist');
        }

        const logs = fs.readFileSync(logFilePath, 'utf8');
        return logs;
    }
}
