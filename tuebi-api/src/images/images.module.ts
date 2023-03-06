import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, UsersService, BookmarksService, CategoriesService, AuthService]
})
export class ImagesModule {}
