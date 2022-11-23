export interface BaseSubscriptionI {
	id: string,
	subscription_name: string,
	subscription_type: string,
	subscription_price: number,
	subscription_currency: string,
	subscription_features: { feature_name: string, feature_on: boolean }[],
}
