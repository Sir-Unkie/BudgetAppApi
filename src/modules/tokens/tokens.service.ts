import {
	CACHE_MANAGER,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import {
	IJwtPayload,
	IJwtTokens,
	TJwtToken,
} from 'src/modules/auth/types/auth.types';
import { Cache } from 'cache-manager';
import { createUserTokenCacheKey } from 'src/utils/cashe.helpers';
import { User } from 'src/modules/users/entities/user.entity';
import { RefreshTokenRepository } from 'src/modules/tokens/repositories/refresh-token.repository';
import { RefreshToken } from 'src/modules/tokens/entities/refresh-token.entity';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { REFRESH_TOKEN_EXP_TIME } from 'src/constants/time.constants';

@Injectable()
export class TokensService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly refreshTokenRepository: RefreshTokenRepository,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async findRefreshTokenInDb(
		refreshToken: TJwtToken,
	): Promise<RefreshToken | null> {
		const foundRefreshToken = await this.refreshTokenRepository.findOneBy({
			token: refreshToken,
		});

		return foundRefreshToken;
	}

	async saveRefreshTokenToDb(
		user: User,
		refreshToken: TJwtToken,
	): Promise<RefreshToken> {
		const foundToken = await this.refreshTokenRepository.findOneBy({
			user: { id: user.id },
		});

		let savedRefreshToken;
		if (foundToken) {
			await this.refreshTokenRepository.update(
				{ user: { id: user.id } },
				{ token: refreshToken },
			);
			savedRefreshToken = { ...foundToken, token: refreshToken };
		} else {
			const createdRefreshToken = this.refreshTokenRepository.create({
				token: refreshToken,
				user,
			});
			savedRefreshToken = await this.refreshTokenRepository.save(
				createdRefreshToken,
			);
		}

		return savedRefreshToken;
	}

	async removeRefreshTokenFromDb(refreshToken: string): Promise<string> {
		try {
			const res = await this.refreshTokenRepository.delete({
				token: refreshToken,
			});

			if (res.affected === 0) {
				throw new UnauthorizedException();
			}

			return `Refresh token removed from db`;
		} catch (err) {
			console.log('err: ', err);
			throw new InternalServerErrorException();
		}
	}

	async issueTokens(payload: IJwtPayload): Promise<IJwtTokens> {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload),
			this.jwtService.signAsync(payload, {
				expiresIn: REFRESH_TOKEN_EXP_TIME,
			}),
		]);

		return { accessToken, refreshToken };
	}

	async verifyAsync<T>(
		token: string,
		options?: JwtVerifyOptions | undefined,
	): Promise<T> {
		const decodedToken = await this.jwtService.verifyAsync(token, options);
		return decodedToken;
	}

	async saveAccessTokenToCache(
		user: User,
		accessToken: unknown,
		ttl?: number | undefined,
	): Promise<void> {
		await this.cacheManager.set(
			createUserTokenCacheKey(user),
			accessToken,
			ttl,
		);
	}

	async removeAccessTokenFromCache(user: User): Promise<void> {
		await this.cacheManager.del(createUserTokenCacheKey(user));
	}
}
