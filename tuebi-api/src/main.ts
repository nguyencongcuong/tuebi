import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(
		AppModule,
		{
			logger: ['log', 'error', 'debug', 'warn', 'verbose']
		}
	);
	const port = process.env.PORT || 8001;
	
	app.enableCors();
	app.use(helmet());
	
	console.log(`Listening to PORT ${port}`);
	await app.listen(port);
}

bootstrap();