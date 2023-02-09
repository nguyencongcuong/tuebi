import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { SecurityService } from '../security/security.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/role.guard';

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		UsersService,
		SecurityService,
		BookmarksService,
		CategoriesService,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
	imports: [
		UsersModule,
		PassportModule
	],
	exports: [AuthService],
})
export class AuthModule {}
