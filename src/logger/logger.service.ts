import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private readonly logger;

    constructor() {
        const logDir = path.join(__dirname, '..', '..', 'logs');
        const exceptionLogDir = path.join(
            __dirname,
            '..',
            '..',
            'logs',
            'exceptions.log'
        );
        const rejectionLogDir = path.join(
            __dirname,
            '..',
            '..',
            'logs',
            'rejections.log'
        );
        const logFilePath = path.join(logDir, 'app.log');

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const logFormat = format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(
                (info) =>
                    `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
            )
        );

        // Create a new logger
        this.logger = createLogger({
            level: 'info',
            format: logFormat,
            transports: [
                new transports.Console(),
                new transports.File({
                    filename: logFilePath,
                }),
            ],
            exceptionHandlers: [
                new transports.Console(),
                new transports.File({
                    filename: exceptionLogDir,
                }),
            ],
            rejectionHandlers: [
                new transports.Console(),
                new transports.File({
                    filename: rejectionLogDir,
                }),
            ],
        });
    }

    log(message: any) {
        this.logger.info(message);
    }

    error(message: any, trace?: string) {
        this.logger.error(message, trace);
    }

    warn(message: any) {
        this.logger.warn(message);
    }
}
