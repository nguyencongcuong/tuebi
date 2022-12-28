import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CategoriesModule } from './categories/categories.module';
import { EmailsModule } from './emails/emails.module';
import { SecurityModule } from './security/security.module';
import { SecurityService } from './security/security.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule } from './users/users.module';
import { ChangelogModule } from './changelog/changelog.module';
import { TaskService } from './task/task.service';

@Module({
	controllers: [AppController],
	providers: [
		JwtService,
		AppService,
		AuthService,
		SecurityService,
		TaskService
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
		ScheduleModule.forRoot()
	]
})
export class AppModule {
}