
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtAuthGuard } from './jwt.strategy';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: loginDto) {
    return this.authService.login(dto);
  }

  // @Post('reset-password')
  // async resetPassword(
  //   @Body() { token, password }: { token: string; password: string },
  // ) {
  //   return this.authService.resetPassword(token, password);
  // }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() request) {
    return {
      message: 'Welcome to profile',
      user: request.user, //fetch user from request
    };
  }
}
