import { Strategy } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { UserRepository } from 'src/modules/users/repositories/users.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { DEFAULT_ROLE_ID } from 'src/modules/users/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly usersRepository: UserRepository,
		private readonly configService: ConfigService,
	) {
		super({
			clientID: configService.get<string>('GOOGLE_AUTH_CLIENT_ID'),
			clientSecret: configService.get<string>('GOOGLE_AUTH_CLIENT_SECRET'),
			callbackURL: 'http://localhost:3000/api/oauth2/redirect/google',
			scope: ['profile', 'email'],
			// TODO: switched to false
			state: false,
		});
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
	): Promise<User> {
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
