class AzureApplicationSettings {
	ENV;
	SALT;
	PEPPER;
	
	SECRET_JWT_TOKEN_KEY = process.env.SECRET_JWT_TOKEN_KEY;
	
	TUEBI_BACKEND_URL;
	TUEBI_FRONTEND_URL;
	
	TUEBI_EMAIL_HOST;
	TUEBI_EMAIL_NO_REPLY_NAME;
	TUEBI_EMAIL_NO_REPLY_ADDRESS;
	TUEBI_EMAIL_NO_REPLY_PASSWORD;
	TUEBI_EMAIL_PORT;
	
	AZURE_COSMOS_DB_ENDPOINT;
	AZURE_COSMOS_DB_PRIMARY_KEY;
	AZURE_COSMOS_DB_DATABASE_NAME;
	
	AZURE_STORAGE_QUEUE_CONNECTION_STRING;
	AZURE_STORAGE_PRIMARY_KEY;
	
	ENCRYPTION_ALGORITHM;
	ENCRYPTION_SECRET_KEY;
	
	constructor(env: string) {
		this.ENV = env;
		if (this.ENV === 'prod') {
			this.initProd();
		} else {
			this.initDev();
		}
	}
	
	initProd() {
		this.SALT = process.env.SALT;
		this.PEPPER = process.env.PEPPER;
		
		this.SECRET_JWT_TOKEN_KEY = process.env.SECRET_JWT_TOKEN_KEY;
		
		this.TUEBI_BACKEND_URL = process.env.TUEBI_BACKEND_URL;
		this.TUEBI_FRONTEND_URL = process.env.TUEBI_FRONTEND_URL;
		
		this.TUEBI_EMAIL_HOST = process.env.TUEBI_EMAIL_HOST;
		this.TUEBI_EMAIL_NO_REPLY_NAME = process.env.TUEBI_EMAIL_NO_REPLY_NAME;
		this.TUEBI_EMAIL_NO_REPLY_ADDRESS = process.env.TUEBI_EMAIL_NO_REPLY_ADDRESS;
		this.TUEBI_EMAIL_NO_REPLY_PASSWORD = process.env.TUEBI_EMAIL_NO_REPLY_PASSWORD;
		this.TUEBI_EMAIL_PORT = process.env.TUEBI_EMAIL_PORT;
		
		this.AZURE_COSMOS_DB_ENDPOINT = process.env.AZURE_COSMOS_DB_ENDPOINT;
		this.AZURE_COSMOS_DB_PRIMARY_KEY = process.env.AZURE_COSMOS_DB_PRIMARY_KEY;
		this.AZURE_COSMOS_DB_DATABASE_NAME = process.env.AZURE_COSMOS_DB_DATABASE_NAME;
		
		this.AZURE_STORAGE_QUEUE_CONNECTION_STRING = process.env.AZURE_STORAGE_QUEUE_CONNECTION_STRING;
		this.AZURE_STORAGE_PRIMARY_KEY = process.env.AZURE_STORAGE_PRIMARY_KEY;
		
		this.ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM;
		this.ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
	}
	
	initDev() {
		this.SALT = '10';
		this.PEPPER = 'H83eVqU@^YmSLp7z@Q8zkQv!GHRP&m';
		
		this.SECRET_JWT_TOKEN_KEY = 'AWb#%*$9MD35HoiWd*nAt&#RkrSK!&';
		
		this.TUEBI_BACKEND_URL = 'http://localhost:3333';
		this.TUEBI_FRONTEND_URL = 'http://localhost:4200';
		
		this.TUEBI_EMAIL_HOST = 'smtpout.secureserver.net';
		this.TUEBI_EMAIL_NO_REPLY_NAME = 'Tuebi';
		this.TUEBI_EMAIL_NO_REPLY_ADDRESS = 'no-reply@tuebi.io';
		this.TUEBI_EMAIL_NO_REPLY_PASSWORD = 'Tg2pyFo0!@#$';
		this.TUEBI_EMAIL_PORT = 465;
		
		this.AZURE_COSMOS_DB_ENDPOINT = 'https://tuebi-dev-db.documents.azure.com:443/';
		this.AZURE_COSMOS_DB_PRIMARY_KEY = 'ys2usMRFIKzjrcSwhV6wZQVI3YY0PHKkr0ddWjgIeXGcWwlCgDcQoBw8c9WPm9raKBGEaoWX5f0jACDbiDJVUg==';
		this.AZURE_COSMOS_DB_DATABASE_NAME = 'tuebidb';
		
		this.AZURE_STORAGE_QUEUE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=tuebistorage;AccountKey=PG4NNuzg8oSGT3375cRHDFWQtXr8Et2o1a+6hNd4BjLlauw8oB8SpnwZAbuOSj/wbIcWWk86iRbv+AStIu8HcA==;EndpointSuffix=core.windows.net';
		this.AZURE_STORAGE_PRIMARY_KEY = 'DefaultEndpointsProtocol=https;AccountName=tuebistorage;AccountKey=PG4NNuzg8oSGT3375cRHDFWQtXr8Et2o1a+6hNd4BjLlauw8oB8SpnwZAbuOSj/wbIcWWk86iRbv+AStIu8HcA==;EndpointSuffix=core.windows.netHide';
		
		this.ENCRYPTION_ALGORITHM = 'aes-256-ctr';
		this.ENCRYPTION_SECRET_KEY = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
	}
	
}

export const azAppSettings = new AzureApplicationSettings(process.env.ENV);