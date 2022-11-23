import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { SecurityService } from '../security/security.service';
import { UsersService } from '../users/users.service';

import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
	controllers: [SubscriptionsController],
	providers: [
		SubscriptionsService,
		JwtService,
		AuthService,
		UsersService,
		SecurityService,
	],
	imports: [],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
