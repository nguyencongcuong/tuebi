import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { CategoriesService } from '../categories/categories.service';
import { ImagesService } from '../images/images.service';
import { SecurityService } from '../security/security.service';
import { TagsService } from '../tags/tags.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { AzDbClient } from '../azure/az-db.client';

@Module({
	controllers: [BookmarksController],
	providers: [
    AzDbClient,
		CategoriesService,
		BookmarksService,
		AuthService,
		UsersService,
		JwtService,
		SecurityService,
		TagsService,
		ImagesService
	],
	imports: [AuthModule, UsersModule, JwtModule],
})
export class BookmarksModule {}
