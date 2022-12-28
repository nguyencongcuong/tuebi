import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AzDbService } from '../azure/az-db.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CategoriesService } from '../categories/categories.service';
import { User } from '../users/users.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class TaskService {
  private userDb = new AzDbService('users');
  private logger = new Logger(TaskService.name);
  
  constructor(
    private bookmarksService: BookmarksService,
    private categoriesService: CategoriesService,
    private userService: UsersService
  ) {}
  
  @Cron(CronExpression.EVERY_6_MONTHS)
  async welcome() {
    this.logger.log(`Cron Job is running. Now is ${new Date().toISOString()}`);
  }
  
  // Timezone: GMT
  @Cron(CronExpression.EVERY_DAY_AT_1AM, { timeZone: 'Antarctica/Troll', name: 'CronJob Example' })
  async deleteUserAccounts() {
    this.logger.log(`Start Cron Job: ${this.deleteUserAccounts.name}`);
    
    // Get all users
    const sqlQuerySpec : SqlQuerySpec = {
      query: 'SELECT c.id, c.user_email, c.partition_key, c.user_last_active_time, c.user_settings FROM c',
    }
    const users = await this.userDb.readMany<User>(sqlQuerySpec);
    
    if(!users.length) {
      this.logger.log(`Finish Cron Job: ${this.deleteUserAccounts.name}. No user to delete`);
      return;
    }
    
    // Get all users whose account can be deleted
    const usersToDelete = users.filter(user => {
      const MONTH_TO_DELETE = user.user_settings.user_month_to_delete;
      
      const userLastActiveTime = new Date(user.user_last_active_time);
      const lastActiveMonth = userLastActiveTime.getMonth();
      const lastActiveDate = userLastActiveTime.getDate();
      
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();
      return currentMonth - lastActiveMonth >= MONTH_TO_DELETE && lastActiveDate === currentDate;
    });
  
    if(!usersToDelete.length) {
      this.logger.log(`Finish Cron Job: ${this.deleteUserAccounts.name}. No user to delete`);
      return;
    }
    
    for (const user of usersToDelete) {
      await this.userService.deleteAllUserData(user.id, user.partition_key);
    }
  
    this.logger.log(`Finish Cron Job: ${this.deleteUserAccounts.name}. ${usersToDelete.length} deleted`);
  }
}