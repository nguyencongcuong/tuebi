import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { AzDbService, PatchPayload } from '../azure/az-db.service';
import { Bookmark } from './bookmarks.interface';

@Injectable()
export class BookmarksService {
	private logger = new Logger(BookmarksService.name);
	private db = new AzDbService('bookmarks');
	
	async createOne(bookmark: Bookmark): Promise<Bookmark> {
		try {
			return await this.db.createOne<Bookmark>(bookmark);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async readOne(id: string, partitionKey: string): Promise<Bookmark> {
		try {
			return await this.db.readOne<Bookmark>(id, partitionKey);
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
	
	async updateOne(bookmark: PatchPayload): Promise<Bookmark> {
		try {
			return await this.db.updateOne<Bookmark>(
				bookmark.id,
				bookmark.partition_key,
				bookmark.operations
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
