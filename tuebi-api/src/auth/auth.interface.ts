export interface JwtI {
	access_token: string;
	token_type: string;
	expired_in?: string;
}

export interface DecodedJwtI {
	id: string;
	user_email: string;
	iat: number;
	exp: number;
}
