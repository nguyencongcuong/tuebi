import { SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { AzDbService, PatchPayload } from '../azure/az-db.service';
import { User } from './users.interface';

@Injectable()
export class UsersService {
	private logger = new Logger(UsersService.name);
	private db = new AzDbService('users');
	
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
}
