import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
    constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: WinstonLoggerService
    ) {}

    // Validate or create a user based on the profile received from Google
    async validateOrCreateUser(profile: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
        let user = await this.userService.findOneByEmail(profile.email);

        // If user does not exist, create a new user
        if (!user) {
            user = await this.userService.create({
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
            });
            this.logger.log(`User ${user.id} created with email ${user.email}`);
        }

        return user;
    }

    // Generate JWT for the user
    generateJwt(user: { id: number; email: string }): string {
        const payload = { userId: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }

    // Authenticate user and generate JWT
    async authenticateUser(profile: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<{ token: string; user: User }> {
        const user = await this.validateOrCreateUser(profile);
        const token = this.generateJwt({ id: user.id, email: user.email });

        return { token, user };
    }
}
