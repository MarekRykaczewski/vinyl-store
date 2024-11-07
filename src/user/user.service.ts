import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Review } from 'src/review/entities/review.entity';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly logger: WinstonLoggerService
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findOneById(id: any): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        this.logger.log(
            `User created: ${user.firstName} ${user.lastName} with email ${user.email}`
        );
        return this.userRepository.save(user);
    }

    async updateProfile(
        userId: number,
        updateData: UpdateUserProfileDto
    ): Promise<User> {
        const user = await this.findOneById(userId);
        Object.assign(user, updateData);
        this.logger.log(`User updated: ${user.firstName} ${user.lastName}`);
        return this.userRepository.save(user);
    }

    async deleteProfile(userId: number): Promise<void> {
        const result = await this.userRepository.delete(userId);
        this.logger.log(`User deleted: ${userId}`);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
    }

    async getUserReviews(userId: number): Promise<Review[]> {
        const user = await this.findOneById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.reviewRepository.find({
            where: {
                user: { id: userId },
            },
        });
    }

    async getUserPurchases(userId: number): Promise<Purchase[]> {
        const user = await this.findOneById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.purchaseRepository.find({
            where: {
                user: { id: userId },
            },
        });
    }
}
