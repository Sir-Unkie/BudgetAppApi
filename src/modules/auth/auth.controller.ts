import {
	Body,
	Controller,
	Get,
	HttpStatus,
	InternalServerErrorException,
	Post,
	UnauthorizedException,
	UseGuards,
	UsePipes,
} from '@nestjs/common';
import { HttpCode, Res } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Response } from 'express';
import { ECookieNames } from 'src/constants/cookie-names.constants';
import { ONE_MONTH } from 'src/constants/time.constants';
import { Cookies } from 'src/customDecorators/cookies.decorator';
import { GetUser } from 'src/customDecorators/user.decorator';
import { TokensService } from 'src/modules/tokens/tokens.service';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/registrationCredentials.dto';
import { GoogleAuthGuard, JwtAuthGuard } from './guards';
import { TJwtToken } from './types/auth.types';
import { ROUTES } from 'src/constants/routes.constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokensService: TokensService,
	) {}

	@Post(ROUTES.REGISTER)
	@ApiOperation({ summary: 'Register new user' })
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(ValidationPipe)
	async register(
		@Body() registrationCredentialsDto: AuthCredentialsDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<TJwtToken> {
		const { accessToken, refreshToken } = await this.authService.register(
			registrationCredentialsDto,
		);

		this.setRefreshTokenCookie(response, refreshToken);

		return accessToken;
	}

	@Post(ROUTES.LOGIN)
	@ApiOperation({ summary: 'Login' })
	@HttpCode(HttpStatus.OK)
	@UsePipes(ValidationPipe)
	async login(
		@Body() loginCredsDto: AuthCredentialsDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<TJwtToken> {
		const { accessToken, refreshToken } = await this.authService.login(
			loginCredsDto,
		);

		this.setRefreshTokenCookie(response, refreshToken);

		return accessToken;
	}

	@Post(ROUTES.REFRESH)
	@ApiOperation({ summary: 'Refresh access token' })
	@HttpCode(HttpStatus.OK)
	@UsePipes(ValidationPipe)
	async refresh(
		@Res({ passthrough: true }) response: Response,
		@Cookies(ECookieNames.REFRESH_TOKEN) refreshToken?: TJwtToken,
	): Promise<TJwtToken | UnauthorizedException> {
		if (!refreshToken) {
			return new UnauthorizedException();
		}
		const { accessToken, refreshToken: newRefreshToken } =
			await this.authService.refresh(refreshToken);

		this.setRefreshTokenCookie(response, newRefreshToken);

		return accessToken;
	}

	@Post(ROUTES.LOGOUT)
	@ApiOperation({ summary: 'Logout' })
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	async logout(
		@GetUser() user: User,
		@Cookies('refreshToken') refreshToken?: string,
	): Promise<string | UnauthorizedException> {
		if (!refreshToken) {
			return new UnauthorizedException();
		}
		return await this.authService.logout(user, refreshToken);
	}

	// TODO: change it to POST request, when ready
	@Get(ROUTES.GOOGLE)
	@ApiOperation({ summary: 'Login with google' })
	@UseGuards(GoogleAuthGuard)
	loginGoogle() {
		return 'google';
	}

	@Get(ROUTES.GOOGLE_REDIRECT)
	@ApiOperation({ summary: 'Login redirect route' })
	@UseGuards(GoogleAuthGuard)
	async respond(
		@GetUser() user: User,
		@Res({ passthrough: true }) response: Response,
	): Promise<TJwtToken> {
		try {
			const { accessToken, refreshToken } =
				await this.tokensService.issueTokens({
					email: user.userEmail,
					id: user.id,
					role: user.role.roleName,
				});

			await Promise.all([
				this.tokensService.saveAccessTokenToCache(user, accessToken),
				this.tokensService.saveRefreshTokenToDb(user, refreshToken),
			]);

			this.setRefreshTokenCookie(response, refreshToken);

			return accessToken;
		} catch (err) {
			throw new InternalServerErrorException();
		}
	}

	setRefreshTokenCookie(response: Response, refreshToken: TJwtToken) {
		response.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			// TODO: https required
			// secure: true,
			expires: new Date(new Date().getTime() + ONE_MONTH),
		});
	}
}
