// Base User: Data structure saved in database

export interface UserSettings {
	is_favicon_shown: boolean;
	is_bookmark_url_shorten: boolean;
	is_bookmark_count_shown: boolean;
}

export interface User {
	id?: string;
	partition_key: string;
	_iv: string;
	user_email: string;
	user_password: string;
	user_name: string;
	user_created_time: string;
	user_last_modified_time: string;
	user_is_confirmed: boolean;
	user_confirmation_code: string;
	user_subscription_id: string;
	user_roles: string[];
	user_settings: UserSettings;
}

// Create User: Data structure for API request body
export interface CreateUserRequestBodyI {
	user_email: string;
	user_password: string;
}

// Update User: Data structure for API request body
export interface UpdateUserRequestBodyI {
	user_email: string;
	user_password: string;
	user_name: string;
	user_updated_password: string;
	user_created_time: string;
	user_is_confirmed: boolean;
	user_confirmation_code: string;
	user_subscription_id: string;
	user_roles: string[];
	user_settings: UserSettings;
}

// User Login
export interface UserLoginRequestBodyI {
	user_email: string;
	user_password: string;
}

// Authed User
export interface AuthedUserI {
	id: string;
	user_email: string;
	user_roles: string[];
	access_token: string;
	token_type: string;
	expired_in: string;
}
