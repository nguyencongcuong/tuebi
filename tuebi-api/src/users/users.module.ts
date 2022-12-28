import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesModule } from '../categories/categories.module';
import { CategoriesService } from '../categories/categories.service';
import { EmailsModule } from '../emails/emails.module';
import { SecurityService } from '../security/security.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	providers: [
		AuthService,
		JwtService,
		UsersService,
		SubscriptionsService,
		CategoriesService,
		BookmarksService,
		SecurityService,
	],
	imports: [EmailsModule],
	exports: [UsersService],
})
export class UsersModule {}
