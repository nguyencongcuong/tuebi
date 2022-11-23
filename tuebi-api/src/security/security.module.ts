import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';

@Module({
	controllers: [],
	providers: [
		SecurityService
	],
	imports: [],
	exports: [SecurityService]
})
export class SecurityModule {

}