import { Strategy } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { UserRepository } from 'src/users/repositories/users.repository';
import { User } from 'src/users/entities/user.entity';
import { DEFAULT_ROLE_ID } from 'src/users/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UserRepository,
  ) {
    super({
      clientID: '1054635415398-sh21n5lvmm3807gurqqs11m76io7cvp2.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/api/oauth2/redirect/google',
      scope: ['profile', 'email'],
      // TODO: switched to false
      state: false,
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<User> {
    if (!profile.emails) {
      throw new HttpException('no email', HttpStatus.FORBIDDEN);
    }

    const userEmail = profile.emails[0].value;

    const foundUser = await this.usersRepository.findOne({
      where: { userEmail },
      relations: { role: true },
    });

    if (foundUser) {
      return foundUser;
    }
    
    const createdUser = this.usersRepository.create({
      role: { id: DEFAULT_ROLE_ID },
      userEmail,
    });
    const savedUser = await this.usersRepository.save(createdUser);

    return savedUser;
  }
}