import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
	CACHE_MANAGER,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { IJwtStrategyPayload } from '../types/auth.types';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from 'src/modules/users/repositories/users.repository';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly usersRepository: UserRepository,
		private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			passReqToCallback: true,
			secretOrKey: configService.get<string>('JWT_SECRET_OR_KEY'),
		});
	}

	async validate(req: Request, payload: IJwtStrategyPayload): Promise<User> {
		const { email } = payload;
		const existingUser = await this.usersRepository.findOne({
			where: { userEmail: email },
			relations: { role: true },
		});

		if (!existingUser) {
			throw new UnauthorizedException();
		}

		const extractedTokenFromHeader = req
			.get('authorization')
			?.replace('Bearer', '')
			.trim();

		if (!extractedTokenFromHeader) {
			throw new UnauthorizedException();
		}

		const tokenFromCache = await this.cacheManager.get(`${email}AccessToken`);
		if (tokenFromCache !== extractedTokenFromHeader) {
			throw new UnauthorizedException();
		}

		return existingUser;
	}
}
