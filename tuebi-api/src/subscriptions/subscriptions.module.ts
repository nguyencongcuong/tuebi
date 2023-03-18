import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { ImagesService } from '../images/images.service';
import { SecurityService } from '../security/security.service';
import { TagsService } from '../tags/tags.service';
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
		BookmarksService,
		CategoriesService,
		TagsService,
		ImagesService
	],
	imports: [BookmarksModule],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
