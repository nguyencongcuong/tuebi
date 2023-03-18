import { Injectable, Logger } from '@nestjs/common';
import { AzBlobStorageClient } from '../azure/az-storage.client';

const sharp = require('sharp');

@Injectable()
export class ImagesService {
  private azureBlobStorageClient = new AzBlobStorageClient('avatars');
  private logger = new Logger(ImagesService.name);
  
  constructor(
  ) {}
  
  async upload(fileName: string, fileBuffer) {
    const metadata = await sharp(fileBuffer).metadata();
    const { width, height } = metadata;
    const cropSize = Math.min(width, height);
    const blobName = `${fileName}.png`;
    const blobContent = await sharp(fileBuffer)
      .extract({
        left: Math.floor((width - cropSize) / 2),
        top: Math.floor((height - cropSize) / 2),
        width: cropSize,
        height: cropSize
      })
      .resize(300)
      .png()
      .toBuffer();
    
    await this.azureBlobStorageClient.uploadBlob(blobName, blobContent);
    
    return await this.azureBlobStorageClient.getBlobUrl(blobName);
  }
  
  async delete(blobName: string): Promise<void> {
    await this.azureBlobStorageClient.deleteBlob(blobName)
  }
}
