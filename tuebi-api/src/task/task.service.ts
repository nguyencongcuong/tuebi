import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AzDbService } from '../azure/az-db.service';
import { User } from '../users/users.interface';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  
  @Cron(CronExpression.EVERY_6_MONTHS)
  async welcome() {
    this.logger.log(`Cron Job is running. Now is ${new Date().toISOString()}`);
  }
}
