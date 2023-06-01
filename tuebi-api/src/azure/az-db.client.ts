import { CosmosClient, Database } from '@azure/cosmos';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzDbClient {
  public azDb: Database;
  private azDbClient: CosmosClient;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get('AZURE_COSMOS_DB_ENDPOINT');
    const key = this.configService.get('AZURE_COSMOS_DB_PRIMARY_KEY');
    const database = this.configService.get('AZURE_COSMOS_DB_DATABASE_NAME');

    this.azDbClient = new CosmosClient({ endpoint, key });
    this.azDb = this.azDbClient.databases.client.database(database);
  }

  // Add methods for interacting with the database using the `azDbClient`
}
