import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { SecurityService } from '../security/security.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
  controllers: [TagsController],
  providers: [
    CategoriesService,
    BookmarksService,
    TagsService,
    AuthService,
    UsersService,
    JwtService,
    SecurityService,
  ],
  imports: [
    AuthModule,
    UsersModule,
    JwtModule
  ],
})
export class TagsModule {}
