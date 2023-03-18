import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { ImagesService } from '../images/images.service';
import { SecurityService } from '../security/security.service';
import { TagsService } from '../tags/tags.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { CategoriesController } from './categories.controller';

import { CategoriesService } from './categories.service';

@Module({
	controllers: [CategoriesController],
	providers: [
		CategoriesService,
		AuthService,
		UsersService,
		JwtService,
		SecurityService,
		BookmarksService,
		TagsService,
		ImagesService
	],
	imports: [AuthModule, UsersModule, JwtModule],
})
export class CategoriesModule {}
