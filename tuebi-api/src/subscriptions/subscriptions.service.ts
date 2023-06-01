import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { AzDbService, PatchPayload } from '../azure/az-db.service';
import { Subscription } from './subscriptions.interface';
import { AzDbClient } from '../azure/az-db.client';

@Injectable()
export class SubscriptionsService {
	private logger = new Logger(SubscriptionsService.name);
	private db: AzDbService;

  constructor(azDbClient: AzDbClient) {
    this.db = new AzDbService(azDbClient, 'subscriptions');
  }
	
	async createOne(subscription: Subscription): Promise<Subscription> {
		try {
			return await this.db.createOne<Subscription>(subscription);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async readOne(id: string, partitionKey: string): Promise<Subscription> {
		try {
			return await this.db.readOne<Subscription>(id, partitionKey);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async readMany<T>(query: SqlQuerySpec): Promise<T[]> {
		try {
			return await this.db.readMany<T>(query);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async updateOne(subscription: PatchPayload): Promise<Subscription> {
		try {
			return await this.db.updateOne(
				subscription.id,
				subscription.partition_key,
				subscription.operations
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
}
