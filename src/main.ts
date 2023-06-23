import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { swaggerConfig } from 'src/config/swagger.config';
import { morganFormat } from 'src/config/morgan.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, document);

	app.use(morgan(morganFormat));
	app.use(helmet());
	app.use(cookieParser());
	app.setGlobalPrefix('api');

	app.enableCors({
		origin: 'http://localhostqwe:3000/',
		credentials: true,
	});

	const APP_PORT = process.env.APP_PORT || 4000;

	await app.listen(APP_PORT);
}
bootstrap();
