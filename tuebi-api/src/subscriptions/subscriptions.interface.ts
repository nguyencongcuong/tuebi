export interface Subscription {
	id?: string;
	partition_key: string;
	subscription_name: 'basic' | 'plus';
	subscription_type: 'monthly' | 'annually';
	subscription_price: string;
	subscription_currency: string;
	subscription_features: {
		feature_name: string;
		feature_on: boolean;
	}[];
}
