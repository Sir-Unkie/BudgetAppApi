import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXP_TIME } from 'src/constants/time.constants';

export const jwtModuleConfigFactory = async (
	configService: ConfigService,
): Promise<JwtModuleOptions> => ({
	secret: configService.get<string>('JWT_SECRET_OR_KEY'),
	signOptions: { expiresIn: ACCESS_TOKEN_EXP_TIME },
});
