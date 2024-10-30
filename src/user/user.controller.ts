import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
  @Get('all') // Route to view all users
    findAllUsers() {
        return this.userService.findAll();
    }
}
