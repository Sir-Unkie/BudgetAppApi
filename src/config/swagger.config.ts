import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
	.addBearerAuth()
	.setTitle('Budget app API')
	.setDescription('The budget app swagger')
	.setVersion('1.0')
	.addTag('Budget app')
	.build();
