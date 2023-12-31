// Base User: Data structure saved in database

export interface UserSettings {
	is_favicon_shown: boolean;
	is_bookmark_count_shown: boolean;
	user_month_to_delete: 3 | 6 | 9 | 12;
}

export interface User {
	id?: string;
	partition_key: string;
	_iv: string;
	user_name: string;
	user_emails: string[],
	user_created_time: number;
	user_last_modified_time: number;
	user_last_active_time: number;
	user_deleted_at: number;
	user_subscription_id: string;
	user_roles: string[];
	user_avatar_url: string;
	user_settings: UserSettings;
}

// Create User: Data structure for API request body
export interface CreateUserRequestBodyI {
	user_object_id: string; // From Azure B2C
	user_emails: string[]
}

// Update User: Data structure for API request body
export interface UpdateUserRequestBodyI {
	user_name: string;
	user_updated_password: string;
	user_created_time: string;
	user_subscription_id: string;
	user_roles: string[];
	user_settings: UserSettings;
	user_avatar_url: string;
}
