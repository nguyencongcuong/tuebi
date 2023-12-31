import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { AzDbClient } from '../azure/az-db.client';

@Module({
  controllers: [ImagesController],
  providers: [AzDbClient, ImagesService, UsersService, BookmarksService, CategoriesService, AuthService, TagsService]
})
export class ImagesModule {}
