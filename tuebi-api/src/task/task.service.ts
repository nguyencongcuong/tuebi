import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AzDbService } from '../azure/az-db.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { User } from '../users/users.interface';
import { UsersService } from '../users/users.service';
import { AzDbClient } from '../azure/az-db.client';

@Injectable()
export class TaskService {
  private userDb: AzDbService;
  private logger = new Logger(TaskService.name);
  
  constructor(
    private bookmarksService: BookmarksService,
    private categoriesService: CategoriesService,
    private userService: UsersService,
    private azDbClient: AzDbClient
  ) {
    this.userDb = new AzDbService(azDbClient, 'users');
  }
  
  @Cron(CronExpression.EVERY_6_MONTHS)
  async welcome() {
    this.logger.log(`Cron Job is running. Now is ${new Date().toISOString()}`);
  }
  
  // Timezone: GMT
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteUserAccounts() {
    this.logger.log(`Start Cron Job: ${this.deleteUserAccounts.name}`);
    
    const now = Math.floor(Date.now() / 1000);
    
    // Query to get users who will be deleted
    const sqlQuerySpec : SqlQuerySpec = {
      query: `
        SELECT c.id, c.partition_key, c.user_email FROM c
        WHERE c.user_deleted_at < @now`,
      parameters: [
        {
          name: '@now',
          value: now
        }
      ]
    }
    const users = await this.userDb.readMany<User>(sqlQuerySpec);
    
    if(!users.length) {
      this.logger.log(`Finish Cron Job: ${this.deleteUserAccounts.name}. No user to delete`);
      return;
    }
    
    for (const user of users) {
      await this.userService.deleteAllUserData(user);
    }
  
    this.logger.log(`Finish Cron Job: ${this.deleteUserAccounts.name}. ${users.length} deleted`);
  }
}