import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { ImagesService } from '../images/images.service';
import { SecurityService } from '../security/security.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

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
    ImagesService
  ],
  imports: [
    AuthModule,
    UsersModule,
    JwtModule
  ],
})
export class TagsModule {}
