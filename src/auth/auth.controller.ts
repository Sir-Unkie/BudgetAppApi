import {  Body, Controller,  Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/registrationCredentials.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() loginCredsDto: AuthCredentialsDto) {
    return this.authService.login(loginCredsDto);
  }
  
  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() registrationCredentialsDto: AuthCredentialsDto) {
    return this.authService.register(registrationCredentialsDto);
  }
}
