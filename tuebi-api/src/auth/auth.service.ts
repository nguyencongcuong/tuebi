import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as Jose from 'jose';

@Injectable()
export class AuthService {
	constructor(
	) {}
	
	async decodeJwt(jwt: string) {
		if(jwt.includes('Bearer')) {
			jwt = jwt.replace('Bearer', '').trim();
		}
		return Jose.decodeJwt(jwt);
	}
	async getPublicKey() {
		// Verify Access Token Signature
		const jwkResponse = await axios.get('https://tuebib2c.b2clogin.com/tuebib2c.onmicrosoft.com/b2c_1_signup-signin-flow/discovery/v2.0/keys');
		const jwk = jwkResponse.data.keys[0];
		const alg = 'RS256';
		return await Jose.importJWK(jwk, alg);
	}
	async verifyJWT(jwt, publicKey) {
		try {
			const result = await Jose.jwtVerify(jwt, publicKey);
			return result.payload;
		} catch (err) {
			return false;
		}
	}
}