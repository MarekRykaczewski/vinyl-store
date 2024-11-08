import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ActivityService {
    constructor() {}
    async readActivities() {
        const logFilePath = path.join(__dirname, '..', '..', 'logs', 'app.log');

        if (!fs.existsSync(logFilePath)) {
            throw new HttpException(
                { message: 'Log file does not exist' },
                HttpStatus.NOT_FOUND
            );
        }

        try {
            const logs = fs.readFileSync(logFilePath, 'utf8');
            return logs;
        } catch (error) {
            throw new HttpException(
                { message: 'Error reading log file', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
