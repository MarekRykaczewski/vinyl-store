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
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({
      summary: 'Get user profile',
      description: 'Retrieves the profile information of the authenticated user.',
  })
  @ApiResponse({
      status: 200,
      description: 'User profile retrieved successfully',
  })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
    async getProfile(@Req() req: Request) {
        const userProfile = (req as Request & { user: any }).user;
        const userId = userProfile.id;
        return this.userService.findOneById(userId);
    }

  @Patch('profile')
  @ApiOperation({
      summary: 'Update user profile',
      description: 'Updates the profile information of the authenticated user.',
  })
  @ApiResponse({
      status: 200,
      description: 'User profile updated successfully',
  })
  @ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid data provided',
  })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ) {
      const userProfile = (req as Request & { user: any }).user;
      const userId = userProfile.id;
      return this.userService.updateProfile(userId, updateUserProfileDto);
  }

  @Delete('profile')
  @ApiOperation({
      summary: 'Delete user profile',
      description: 'Deletes the profile of the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
  async deleteProfile(@Req() req: Request) {
      const userProfile = (req as Request & { user: any }).user;
      const userId = userProfile.id;
      await this.userService.deleteProfile(userId);
      return { message: 'Profile deleted successfully' };
  }

  @Get('reviews')
  @ApiOperation({
      summary: 'Get user reviews',
      description: 'Retrieves all reviews created by the authenticated user.',
  })
  @ApiResponse({
      status: 200,
      description: 'User reviews retrieved successfully',
  })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
  async getUserReviews(@Req() req: Request) {
      const userProfile = (req as Request & { user: any }).user;
      const userId = userProfile.id;
      return this.userService.getUserReviews(userId);
  }

  @Get('purchases')
  @ApiOperation({
      summary: 'Get user purchases',
      description: 'Retrieves all purchases made by the authenticated user.',
  })
  @ApiResponse({
      status: 200,
      description: 'User purchases retrieved successfully',
  })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
  async getUserPurchases(@Req() req: Request) {
      const userProfile = (req as Request & { user: any }).user;
      const userId = userProfile.id;
      return this.userService.getUserPurchases(userId);
  }
}
