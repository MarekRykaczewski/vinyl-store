import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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
}
