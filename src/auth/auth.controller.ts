import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @Get('google')
  @ApiOperation({
      summary: 'Google OAuth login',
      description: 'Starts Google OAuth authentication flow',
  })
  @UseGuards(AuthGuard('google'))
    async googleAuth() {
    // Initiates Google OAuth flow
    }

  @Get('google/redirect')
  @ApiOperation({
      summary: 'Google OAuth redirect callback',
      description: 'Handles Google OAuth callback and issues a JWT',
  })
  @ApiResponse({
      status: 200,
      description: 'User successfully authenticated and JWT issued',
  })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - Google authentication failed',
  })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
      try {
      // Extract user information from the request
          const userProfile = (req as Request & { user: any }).user;
          if (!userProfile) {
              throw new HttpException(
                  'Unauthorized - Google authentication failed',
                  HttpStatus.UNAUTHORIZED
              );
          }

          // Validate or create user in the database
          const user = await this.authService.validateOrCreateUser({
              email: userProfile.email,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
          });

          // Generate JWT
          const jwt = this.authService.generateJwt(user);

          // Set JWT
          res.cookie('jwt', jwt, { httpOnly: true });
          return res.status(200).json({ token: jwt });
      } catch (error) {
          throw new HttpException(
              error.message || 'Authentication failed',
              error.status || HttpStatus.UNAUTHORIZED
          );
      }
  }

  @ApiBearerAuth()
  @Get('logout')
  @ApiOperation({
      summary: 'Logout',
      description: 'Logs the user out by clearing the JWT cookie',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({
      status: 401,
      description: 'Unauthorized - User not logged in',
  })
  @UseGuards(AuthGuard('jwt'))
  logout(@Res() res: Response) {
      // Clear the JWT cookie
      res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
      return res.send({ message: 'Logged out successfully' });
  }
}
