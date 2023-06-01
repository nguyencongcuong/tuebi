import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { EmailsModule } from '../emails/emails.module';
import { ImagesService } from '../images/images.service';
import { SecurityService } from '../security/security.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { TagsService } from '../tags/tags.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AzDbClient } from '../azure/az-db.client';

@Module({
	controllers: [UsersController],
	providers: [
    AzDbClient,
		AuthService,
		JwtService,
		UsersService,
		SubscriptionsService,
		CategoriesService,
		BookmarksService,
		TagsService,
		SecurityService,
		ImagesService
	],
	imports: [EmailsModule],
	exports: [UsersService],
})
export class UsersModule {}
