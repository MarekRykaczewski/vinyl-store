import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({
      summary: 'Get all activities',
      description:
      'Retrieves a list of all activities. Accessible by Admins only.',
  })
  @ApiResponse({
      status: 200,
      description: 'List of activities retrieved successfully',
  })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Bearer token missing or invalid',
  })
  @ApiResponse({
      status: 403,
      description: 'Forbidden - User lacks necessary permissions',
  })
    async getActivities() {
        return await this.activityService.readActivities();
    }
}
