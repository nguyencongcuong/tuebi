import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { CategoriesService } from '../categories/categories.service';
import { SecurityService } from '../security/security.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

@Module({
	controllers: [BookmarksController],
	providers: [
		CategoriesService,
		BookmarksService,
		AuthService,
		UsersService,
		JwtService,
		SecurityService,
	],
	imports: [AuthModule, UsersModule, JwtModule],
})
export class BookmarksModule {}
