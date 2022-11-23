import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { AzDbService, PatchPayload } from '../azure/az-db.service';
import { Category } from './categories.interface';

@Injectable()
export class CategoriesService {
	private logger = new Logger(CategoriesService.name);
	private db = new AzDbService('categories');
	
	async createOne(category: Category): Promise<Category> {
		try {
			return await this.db.createOne<Category>(category);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async readOne(id: string, partitionKey: string): Promise<Category> {
		try {
			return await this.db.readOne<Category>(id, partitionKey);
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
	
	async updateOne(category: PatchPayload): Promise<Category> {
		try {
			return await this.db.updateOne<Category>(
				category.id,
				category.partition_key,
				category.operations
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
