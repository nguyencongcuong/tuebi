import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { ImagesService } from '../images/images.service';
import { SecurityService } from '../security/security.service';
import { TagsService } from '../tags/tags.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/role.guard';
import { AzDbClient } from '../azure/az-db.client';

@Module({
	controllers: [AuthController],
	providers: [
    AzDbClient,
		AuthService,
		UsersService,
		SecurityService,
		BookmarksService,
		CategoriesService,
		TagsService,
		ImagesService,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
	imports: [
		UsersModule,
		PassportModule,
	],
	exports: [AuthService],
})
export class AuthModule {}
