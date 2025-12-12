import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, TokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {}

  @Get('me')
  async getMe(@Param('token') token: TokenDto) {}

  @Get('refresh-token')
  async refreshToken(@Param('token') token: TokenDto) {}
}
