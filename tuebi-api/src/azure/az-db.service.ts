import { Container, PatchOperation, SqlQuerySpec } from '@azure/cosmos';
import { Injectable } from '@nestjs/common';
import { azDb } from './az-db.client';

export type ContainerName =
	| 'users'
	| 'categories'
	| 'bookmarks'
	| 'subscriptions';

export interface PatchPayload {
	id: string;
	partition_key: string;
	operations: PatchOperation[];
}

@Injectable()
export class AzDbService {
	private container: Container;
	
	constructor(containerName: ContainerName) {
		this.container = azDb.container(containerName);
	}
	
	async createOne<T>(item: T): Promise<T> {
		const body = item['partition_key'] ? item : {...item, partition_key: ''};
		const {resource} = await this.container.items.create(body);
		return resource;
	}
	
	async readOne<T>(id: string, partitionKey: string): Promise<T> {
		const {resource} = await this.container.item(id, partitionKey).read();
		return resource;
	}
	
	async readMany<T>(querySpec: SqlQuerySpec): Promise<T[]> {
		const {resources} = await this.container.items
			.query(querySpec)
			.fetchAll();
		return resources;
	}
	
	async updateOne<T>(
		id: string,
		partitionKey: string,
		operations: PatchOperation[]
	): Promise<T> {
		const {resource} = await this.container
			.item(id, partitionKey)
			.patch(operations);
		return resource;
	}
	
	async deleteOne(id: string, partitionKey: string): Promise<void> {
		await this.container.item(id, partitionKey).delete();
	}
}
