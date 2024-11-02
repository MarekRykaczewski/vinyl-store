import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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
        return this.userRepository.save(user);
    }

    async updateProfile(
        userId: number,
        updateData: UpdateUserProfileDto
    ): Promise<User> {
        const user = await this.findOneById(userId);
        Object.assign(user, updateData);
        return this.userRepository.save(user);
    }

    async deleteProfile(userId: number): Promise<void> {
        const result = await this.userRepository.delete(userId);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
    }
}
