import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as path from 'path';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private readonly logger;

    constructor() {
    // Define log format
        const logFormat = format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(
                (info) =>
                    `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
            )
        );

        // Initialize logger
        this.logger = createLogger({
            level: 'info',
            format: logFormat,
            transports: [
                // Transport to console
                new transports.Console(),
                // Transport to file
                new transports.File({
                    filename: path.join(__dirname, '..', 'logs', 'app.log'),
                }),
            ],
            exceptionHandlers: [
                new transports.Console(),
                new transports.File({
                    filename: path.join(__dirname, '..', 'logs', 'exceptions.log'),
                }),
            ],
            rejectionHandlers: [
                new transports.Console(),
                new transports.File({
                    filename: path.join(__dirname, '..', 'logs', 'rejections.log'),
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
