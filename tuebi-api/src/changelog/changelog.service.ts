import { Injectable } from '@nestjs/common';
import { AzBlobStorageClient } from '../azure/az-storage.client';
import { CreateChangelogDto } from './dto/create-changelog.dto';

@Injectable()
export class ChangelogService {
  private azureBlobStorageClient = new AzBlobStorageClient('enums');
  private BLOB_NAME = 'changelog.json';
  
  async create(createChangelogDto: CreateChangelogDto) {
    const content = JSON.stringify(createChangelogDto);
    await this.azureBlobStorageClient.uploadBlob(this.BLOB_NAME, content);
  }

  async read() {
    const rawJson = await this.azureBlobStorageClient.downloadBlob(this.BLOB_NAME);
    return JSON.parse(rawJson);
  }

  async delete() {
    await this.azureBlobStorageClient.deleteBlob(this.BLOB_NAME);
  }
}
