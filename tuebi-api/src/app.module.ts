import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { BookmarksService } from './bookmarks/bookmarks.service';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesService } from './categories/categories.service';
import { ChangelogModule } from './changelog/changelog.module';
import { EmailsModule } from './emails/emails.module';
import { ImagesModule } from './images/images.module';
import { ImagesService } from './images/images.service';
import { SecurityModule } from './security/security.module';
import { SecurityService } from './security/security.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TagsModule } from './tags/tags.module';
import { TagsService } from './tags/tags.service';
import { TaskService } from './task/task.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
	controllers: [AppController],
	providers: [
		JwtService,
		AppService,
		AuthService,
		SecurityService,
		BookmarksService,
		CategoriesService,
		UsersService,
		TaskService,
		TagsService,
		ImagesService
	],
	imports: [
		JwtModule,
		AuthModule,
		SecurityModule,
		UsersModule,
		SubscriptionsModule,
		CategoriesModule,
		BookmarksModule,
		EmailsModule,
		ChangelogModule,
		ScheduleModule.forRoot(),
		TagsModule,
		ImagesModule
	]
})
export class AppModule {
}