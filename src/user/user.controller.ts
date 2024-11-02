import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

  @Get('profile')
    async getProfile(@Req() req: Request) {
        const userProfile = (req as Request & { user: any }).user;
        const userId = userProfile.id;
        return this.userService.findOneById(userId);
    }

  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ) {
      const userProfile = (req as Request & { user: any }).user;
      const userId = userProfile.id;
      return this.userService.updateProfile(userId, updateUserProfileDto);
  }

  @Delete('profile')
  async deleteProfile(@Req() req: Request) {
      const userProfile = (req as Request & { user: any }).user;
      const userId = userProfile.id;
      await this.userService.deleteProfile(userId);
      return { message: 'Profile deleted successfully' };
  }
}
