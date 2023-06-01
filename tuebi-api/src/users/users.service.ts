import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import { AzDbService, PatchPayload } from '../azure/az-db.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Category } from '../categories/categories.interface';
import { CategoriesService } from '../categories/categories.service';
import { ImagesService } from '../images/images.service';
import { Tag } from '../tags/entities/tag.entity';
import { TagsService } from '../tags/tags.service';
import { User } from './users.interface';
import { AzDbClient } from '../azure/az-db.client';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  private db: AzDbService;

  constructor(
    private bookmarksService: BookmarksService,
    private categoriesService: CategoriesService,
    private tagsService: TagsService,
    private imagesService: ImagesService,
    private azDbClient: AzDbClient,
  ) {
    this.db = new AzDbService(azDbClient, 'users');
    
  }
  
  async createOne(user: User): Promise<User> {
    try {
      return await this.db.createOne<User>(user);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
  async readOne(id: string, partitionKey: string): Promise<User> {
    try {
      return await this.db.readOne<User>(id, partitionKey);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
  async readMany(query: SqlQuerySpec): Promise<User[]> {
    try {
      return await this.db.readMany<User>(query);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
  async updateOne(user: PatchPayload): Promise<User> {
    try {
      return await this.db.updateOne<User>(
        user.id,
        user.partition_key,
        user.operations
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
  async deleteOne(id: string, partitionKey: string): Promise<void> {
    try {
      await this.db.deleteOne(id, partitionKey);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
  async deleteAllUserData(user: User): Promise<void> {
    const {id, partition_key, user_avatar_url} = user;
    const querySpec: SqlQuerySpec = {query: 'SELECT c.id, c.partition_key FROM c'};
    
    // Delete all bookmarks by user
    const bookmarks = await this.bookmarksService.readMany<{ id: string; partition_key: string; }>(querySpec);
    if (bookmarks.length) {
      for (const item of bookmarks) {
        await this.bookmarksService.deleteOne(item.id, item.partition_key);
      }
    }
    
    // Delete all categories by user
    const categories = await this.categoriesService.readMany<Category>(querySpec);
    if (categories.length) {
      for (const item of categories) {
        await this.categoriesService.deleteOne(item.id, item.partition_key);
      }
    }
    
    // Delete all tags by user
    const tags = await this.tagsService.readMany<Tag>(querySpec);
    if (tags.length) {
      for (const item of tags) {
        await this.tagsService.deleteOne(item.id, item.partition_key);
      }
    }
    
    // Delete user avatar
    await this.imagesService.delete(`${id}.png`);
    
    // Delete user
    await this.deleteOne(id, partition_key);
  }
  
  async calculateEpochTimeToDeleteUser(monthToDelete: number) {
    const now = DateTime.local(); // current date and time
    const monthsToDeleteUser = now.plus({months: monthToDelete}); // same day, 2 months later
    return Math.floor(monthsToDeleteUser.toSeconds());// number of seconds between now and 2 months later
  }
}
