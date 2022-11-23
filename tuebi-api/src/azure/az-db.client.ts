import { CosmosClient, CosmosClientOptions } from '@azure/cosmos';
import { azAppSettings } from './azure-application-settings';

const options: CosmosClientOptions = {
	endpoint: azAppSettings.AZURE_COSMOS_DB_ENDPOINT,
	key: azAppSettings.AZURE_COSMOS_DB_PRIMARY_KEY,
};

export const azDbClient = new CosmosClient(options);

export const azDb = azDbClient.databases.client.database(
	azAppSettings.AZURE_COSMOS_DB_DATABASE_NAME
);
