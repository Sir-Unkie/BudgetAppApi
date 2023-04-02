import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { swaggerConfig } from 'src/config/swagger.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, document);

	app.use(helmet());
	app.use(cookieParser());
	app.setGlobalPrefix('api');

	app.enableCors({
		origin: [
			'http://example.com',
			'http://www.example.com',
			'http://app.example.com',
			'https://example.com',
			'https://www.example.com',
			'https://app.example.com',
		],
		methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
		credentials: true,
	});

	const APP_PORT = process.env.APP_PORT || 4000;

	await app.listen(APP_PORT);
}
bootstrap();
