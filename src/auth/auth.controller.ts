import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
    async googleAuth() {
    // Initiates Google OAuth flow
    }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
      // Extract user information from the request
      const userProfile = (req as Request & { user: any }).user;

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
      res.redirect('/'); 
  }
}
