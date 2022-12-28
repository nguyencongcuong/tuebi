export interface UserSettings {
	is_compact_mode_on: boolean,
	is_favicon_shown: boolean;
	is_bookmark_url_shorten: boolean;
	is_bookmark_count_shown: boolean;
	is_bookmark_url_shown: boolean;
	user_month_to_delete: 3 | 6 | 9 | 12;
}

export interface User {
	id: string,
	user_email: string,
	user_password: string,
	user_updated_password: string,
	user_name: string;
	user_created_time: string,
	user_last_modified_time: string,
	user_subscription_id: string,
	user_is_confirmed: boolean,
	user_confirmation_code: string,
	user_roles: string[],
	user_settings: UserSettings
}