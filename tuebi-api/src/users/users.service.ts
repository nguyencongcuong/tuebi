import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { AzDbService, PatchPayload } from '../azure/az-db.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Category } from '../categories/categories.interface';
import { CategoriesService } from '../categories/categories.service';
import { User } from './users.interface';

@Injectable()
export class UsersService {
	private logger = new Logger(UsersService.name);
	private db = new AzDbService('users');
	
	constructor(
		private bookmarksService: BookmarksService,
		private categoriesService: CategoriesService
	) {}
	
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
	
	async deleteAllUserData(id: string, partitionKey: string) : Promise<void> {
		const querySpec: SqlQuerySpec = { query: 'SELECT c.id, c.partition_key FROM c' };
		
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
		
		// Delete user
		await this.deleteOne(id, partitionKey);
	}
}
