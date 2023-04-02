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

	const APP_PORT = process.env.APP_PORT || 4000;
	console.log('lsitening on port: ', APP_PORT);

	await app.listen(APP_PORT);
}
bootstrap();
