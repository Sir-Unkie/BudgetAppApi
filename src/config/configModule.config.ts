import { ConfigModuleOptions } from '@nestjs/config';

export const configModuleConfig: ConfigModuleOptions = {
	envFilePath:
		process.env.NODE_ENV === 'development'
			? 'env/.development.env'
			: 'env/.production.env',
	isGlobal: true,
};
