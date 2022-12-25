export interface AuthedUserI {
	id: string;
	user_email: string;
	access_token: string;
	token_type: string;
	expired_in: string;
}

export interface AuthState {
	user: AuthedUserI | undefined;
}
