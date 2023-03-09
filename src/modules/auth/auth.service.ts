import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from 'src/modules/users/repositories/users.repository';
import { UsersService } from 'src/modules/users/users.service';
import { AuthCredentialsDto } from './dto/registrationCredentials.dto';
import {
	IJwtPayload,
	IJwtPayloadWithTimes,
	IJwtTokens,
	TJwtToken,
} from './types/auth.types';
import { User } from 'src/modules/users/entities/user.entity';
import { TokensService } from 'src/modules/tokens/tokens.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersRepository: UserRepository,
		private readonly usersService: UsersService,
		private readonly tokensService: TokensService,
	) {}

	// TODO: implement reset password logic with emails and stuff
	async register(
		registrationCredentialsDto: AuthCredentialsDto,
	): Promise<IJwtTokens> {
		try {
			const createdUser = await this.usersService.create(
				registrationCredentialsDto,
			);
			const payload: IJwtPayload = {
				email: createdUser.userEmail,
				id: createdUser.id,
				role: createdUser.role,
			};

			const { accessToken, refreshToken } =
				await this.tokensService.issueTokens(payload);

			return { accessToken, refreshToken };
		} catch (err) {
			console.log('err: ', err);
			throw new InternalServerErrorException();
		}
	}

	async login(loginCredsDto: AuthCredentialsDto): Promise<IJwtTokens> {
		try {
			const foundUser = await this.usersRepository.findOne({
				where: { userEmail: loginCredsDto.userEmail },
				relations: { role: true },
			});

			if (!foundUser) {
				throw new NotFoundException(`No such user with given username`);
			}

			const recievedPasswordHash = await bcrypt.hash(
				loginCredsDto.password,
				foundUser.salt,
			);
			const isPwValid = recievedPasswordHash === foundUser.password;

			if (!isPwValid) {
				throw new UnauthorizedException('Invalid credentials');
			}

			const payload: IJwtPayload = {
				email: foundUser.userEmail,
				id: foundUser.id,
				role: foundUser.role.roleName,
			};

			const { accessToken, refreshToken } =
				await this.tokensService.issueTokens(payload);

			await Promise.all([
				this.tokensService.saveAccessTokenToCache(foundUser, accessToken),
				this.tokensService.saveRefreshTokenToDb(foundUser, refreshToken),
			]);

			return { accessToken, refreshToken };
		} catch (err) {
			console.log('err: ', err);
			throw err;
		}
	}

	async refresh(refreshToken: TJwtToken): Promise<IJwtTokens> {
		try {
			const decodedRefreshToken =
				await this.tokensService.verifyAsync<IJwtPayloadWithTimes>(
					refreshToken,
				);
			const { email } = decodedRefreshToken;

			const [foundRefreshTokenInDb, foundUser] = await Promise.all([
				this.tokensService.findRefreshTokenInDb(refreshToken),
				this.usersRepository.findOne({
					where: { userEmail: email },
					relations: { role: true },
				}),
			]);

			if (!foundRefreshTokenInDb) throw new UnauthorizedException();
			if (!foundUser) throw new UnauthorizedException('No user found');

			const newPayload = {
				email: foundUser.userEmail,
				id: foundUser.id,
				role: foundUser.role.roleName,
			};

			const { accessToken, refreshToken: newRefreshToken } =
				await this.tokensService.issueTokens(newPayload);

			await Promise.all([
				this.tokensService.saveAccessTokenToCache(foundUser, accessToken),
				this.tokensService.saveRefreshTokenToDb(foundUser, newRefreshToken),
			]);

			return { accessToken, refreshToken: newRefreshToken };
		} catch (err) {
			if (err) {
				throw err;
			} else {
				throw new InternalServerErrorException();
			}
		}
	}

	async logout(user: User, refreshToken: string): Promise<string> {
		try {
			await Promise.all([
				this.tokensService.removeAccessTokenFromCache(user),
				this.tokensService.removeRefreshTokenFromDb(refreshToken),
			]);

			return 'Logged out';
		} catch (err) {
			console.log('err: ', err);
			throw new InternalServerErrorException();
		}
	}
}
