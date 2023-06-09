import { Controller, Post, Body, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './interfaces/login-response.dto';
import { ResponseDto } from 'src/helpers/response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  signIn(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto, @Req() req): Promise<ResponseDto> {
    return this.authService.forgotPassword(forgotPassword, req)
  }

  @Post('password-reset/:token')
  async resetPassword(@Param('token') token: string, @Body() userPassword: ResetPasswordDto): Promise<ResponseDto> {
    return await this.authService.resetPassword(token, userPassword);
  }
}
