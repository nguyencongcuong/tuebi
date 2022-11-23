import { ContainerClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { azAppSettings } from './azure-application-settings';
const { BlobServiceClient } = require("@azure/storage-blob");

@Injectable()
export class AzBlobStorageClient {
	private connectionString = azAppSettings.AZURE_STORAGE_PRIMARY_KEY;
	private blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
	private containerClient: ContainerClient;
	
	constructor(container: string) {
		this.containerClient = this.blobServiceClient.getContainerClient(container);
	}
	
	// Get blob content from position 0 to the end
	// In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
	async downloadBlob(blobName: string) {
		const blobClient = this.containerClient.getBlobClient(blobName);
		const downloadBlockBlobResponse = await blobClient.download();
		const downloaded = (await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();
		return downloadBlockBlobResponse;
	}
	
	// [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
	private async streamToBuffer(readableStream) {
		return new Promise((resolve, reject) => {
			const chunks = [];
			readableStream.on("data", (data) => {
				chunks.push(data instanceof Buffer ? data : Buffer.from(data));
			});
			readableStream.on("end", () => {
				resolve(Buffer.concat(chunks));
			});
			readableStream.on("error", reject);
		});
	}
}