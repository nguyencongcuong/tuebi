import {
  PeekedMessageItem, QueueClearMessagesOptions, QueueClearMessagesResponse,
  QueueClient,
  QueueDeleteOptions,
  QueueDeleteResponse,
  QueuePeekMessagesOptions,
  QueueReceiveMessageOptions,
  QueueSendMessageOptions,
  QueueUpdateMessageOptions,
  QueueUpdateMessageResponse,
  ReceivedMessageItem
} from '@azure/storage-queue';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzStorageQueueClient {
  private queueClient: QueueClient;
  private AZURE_STORAGE_CONNECTION_STRING;
  
  constructor(queueName: string, private configService: ConfigService) {
    this.AZURE_STORAGE_CONNECTION_STRING = this.configService.get('AZURE_STORAGE_QUEUE_CONNECTION_STRING')
    this.queueClient = new QueueClient(this.AZURE_STORAGE_CONNECTION_STRING, queueName);
  }

  // Create a Message for a Queue
  async sendMessage(message: string, options?: QueueSendMessageOptions): Promise<string> {
    const queueResponse = await this.queueClient.sendMessage(message, options);
    return queueResponse.messageId;
  }

  // Read One or Many Messages from a Queue without Changing the Visibility
  async peekMessages(options?: QueuePeekMessagesOptions): Promise<PeekedMessageItem[]> {
    const queueResponse = await this.queueClient.peekMessages(options);
    return queueResponse.peekedMessageItems;
  }

  // Read One or Many Messages from a Queue and Change the Visibility
  async receiveMessages(options: QueueReceiveMessageOptions): Promise<ReceivedMessageItem[]> {
    const queueResponse = await this.queueClient.receiveMessages(options);
    return queueResponse.receivedMessageItems;
  }

  // Update a Message in a Queue
  async updateMessage(
    messageId: string,
    popReceipt: string,
    message?: string,
    visibilityTimeout?: number,
    options?: QueueUpdateMessageOptions
  ): Promise<QueueUpdateMessageResponse> {
    return await this.queueClient.updateMessage(messageId, popReceipt, message, visibilityTimeout, options);
  }

  // Delete a Message from a Queue
  async deleteMessage(
    messageId: string,
    popReceipt: string,
    options: QueueDeleteOptions
  ): Promise<QueueDeleteResponse> {
    return await this.queueClient.deleteMessage(messageId, popReceipt, options);
  }

  // Delete All Messages from a Queue
  async clearMessage(options: QueueClearMessagesOptions): Promise<QueueClearMessagesResponse> {
    return await this.queueClient.clearMessages();
  }
}