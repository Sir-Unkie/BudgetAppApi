import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.setGlobalPrefix('api');

	const APP_PORT = process.env.APP_PORT || 3000;

	await app.listen(APP_PORT);
}
bootstrap();
