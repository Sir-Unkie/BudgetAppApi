import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfigFactory } from 'src/config/jwtModule.config';
import { RefreshTokenRepository } from 'src/modules/tokens/repositories/refresh-token.repository';
import { TokensService } from './tokens.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: jwtModuleConfigFactory,
			inject: [ConfigService],
		}),
	],
	controllers: [],
	providers: [TokensService, RefreshTokenRepository],
	exports: [TokensService],
})
export class TokensModule {}
