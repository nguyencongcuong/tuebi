import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
	controllers: [EmailsController],
	providers: [
		EmailsService
	],
	imports: [],
	exports: [EmailsService]
})
export class EmailsModule {
}