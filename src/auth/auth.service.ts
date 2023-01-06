import {  Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from 'src/users/repositories/users.repository';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/registrationCredentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
  ) { }

  async register(registrationCredentialsDto: AuthCredentialsDto) {
    await this.usersService.create(registrationCredentialsDto);
    return 'Registered!';
  }

  async login(loginCredsDto: AuthCredentialsDto) {
    const foundUser = await this.usersRepository.findOneBy({ userName: loginCredsDto.userName });
    
    if (!foundUser) {
      throw new NotFoundException(`No such user with given username`);
    }

    const recievedPasswordHash = await bcrypt.hash(loginCredsDto.password, foundUser.salt);
    const isPwValid = recievedPasswordHash === foundUser.password;
    return isPwValid ? 'logged in' : 'wrong pw';
  }
}
