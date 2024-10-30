import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
    ) {}

    async validateOrCreateUser(profile: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
        let user = await this.userService.findOneByEmail(profile.email);

        if (!user) {
            user = await this.userService.create({
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
            });
        }

        return user;
    }

    generateJwt(user: { id: number; email: string }) {
        const payload = { userId: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }
}
