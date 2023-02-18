import {  Body, Controller,  Get,  HttpStatus,  Post, UseGuards, UsePipes } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { GetUser } from 'src/customDecorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/registrationCredentials.dto';
import { GoogleAuthGuard, JwtAuthGuard } from './guards';
import { JwtToken } from './types/auth.types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  login(@Body() loginCredsDto: AuthCredentialsDto): Promise<JwtToken> {
    return this.authService.login(loginCredsDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  refresh(@Body() loginCredsDto: AuthCredentialsDto): Promise<JwtToken> {
    return this.authService.login(loginCredsDto);
  }
  
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  register(@Body() registrationCredentialsDto: AuthCredentialsDto): Promise<JwtToken> {
    return this.authService.register(registrationCredentialsDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetUser() user: User): Promise<string> {
    return this.authService.logout(user);
  }

  // TODO: change it to POST request, when ready
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {
    return 'google';
  }

  @Get('oauth2/redirect/google')
  @UseGuards(GoogleAuthGuard)
  respond(@GetUser() user: User): Promise<JwtToken> {
    // TODO: need to properly type payload
    return this.authService.issueToken({
      email: user.userEmail,
      id: user.id,
      role: user.role.roleName,
    });
  }
}
