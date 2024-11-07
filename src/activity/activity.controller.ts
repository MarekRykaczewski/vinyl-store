import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

  // Endpoint to get activities (for Admins only)
  @Get()
    async getActivities() {
        return await this.activityService.readActivities();
    }
}
