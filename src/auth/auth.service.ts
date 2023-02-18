import {
	CACHE_MANAGER,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UserRepository } from "src/users/repositories/users.repository";
import { UsersService } from "src/users/users.service";
import { AuthCredentialsDto } from "./dto/registrationCredentials.dto";
import { IJwtPayload, JwtToken } from "./types/auth.types";
import { Cache } from "cache-manager";
import { User } from "src/users/entities/user.entity";
import { createUserTokenCacheKey } from "src/utils/cashe.helpers";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersRepository: UserRepository,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	// TODO: implement reset password logic with emails and stuff
	async register(
		registrationCredentialsDto: AuthCredentialsDto,
	): Promise<JwtToken> {
		const createdUser = await this.usersService.create(
			registrationCredentialsDto,
		);
		const payload: IJwtPayload = {
			email: createdUser.userEmail,
			id: createdUser.id,
			role: createdUser.role.roleName,
		};
		const accessToken = await this.issueToken(payload);

		return accessToken;
	}

	async login(loginCredsDto: AuthCredentialsDto): Promise<JwtToken> {
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
			throw new UnauthorizedException("Invalid credentials");
		}

		const payload: IJwtPayload = {
			email: foundUser.userEmail,
			id: foundUser.id,
			role: foundUser.role.roleName,
		};
		const accessToken = await this.issueToken(payload);

		await this.cacheManager.set(
			createUserTokenCacheKey(foundUser),
			accessToken,
		);

		// TODO: new logic with AT and RT
		const [at, rt] = await this.issueTokens(payload);
		console.log("rt: ", rt);
		console.log("at: ", at);
		// TODO: Refresh Token should be sent stored in a cookie

		// TODO: lint rule - unused vars - revisit

		//TODO: here we can probably add tokens to cash as VALID tokens

		return accessToken;
	}

	async issueToken(payload: IJwtPayload): Promise<JwtToken> {
		return this.jwtService.signAsync(payload);
	}

	// TODO: replace later isuueToken with this method
	async issueTokens(payload: IJwtPayload): Promise<JwtToken[]> {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload),
			this.jwtService.signAsync(payload, {
				expiresIn: 60 * 69 * 24 * 3,
			}),
		]);

		return [accessToken, refreshToken];
	}

	async logout(user: User): Promise<string> {
		await this.cacheManager.del(createUserTokenCacheKey(user));
		return "Logged out";
	}
}
