import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Review } from 'src/review/entities/review.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Review, Purchase])],
    providers: [UserService, WinstonLoggerService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
