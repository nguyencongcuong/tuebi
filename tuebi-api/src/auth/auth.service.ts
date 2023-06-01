import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

const Jose = require('jose');

@Injectable()
export class AuthService {
  AZURE_B2C_TENANT_NAME;
  AZURE_B2C_USER_FLOW_SIGNUP_SIGNIN;
  
	constructor(
    private configService: ConfigService
	) {
    this.AZURE_B2C_TENANT_NAME = this.configService.get('AZURE_B2C_TENANT_NAME');
    this.AZURE_B2C_USER_FLOW_SIGNUP_SIGNIN = this.configService.get('AZURE_B2C_USER_FLOW_SIGNUP_SIGNIN');
  }
	
	async decodeJwt(jwt: string) {
		if(jwt.includes('Bearer')) {
			jwt = jwt.replace('Bearer', '').trim();
		}
		return Jose.decodeJwt(jwt);
	}
	async getPublicKey() {
		// Verify Access Token Signature
		const jwkResponse = await axios.get(`https://${this.AZURE_B2C_TENANT_NAME}.b2clogin.com/${this.AZURE_B2C_TENANT_NAME}.onmicrosoft.com/${this.AZURE_B2C_USER_FLOW_SIGNUP_SIGNIN}/discovery/v2.0/keys`);
		const jwk = jwkResponse.data.keys[0];
		const alg = 'RS256';

		return await Jose.importJWK(jwk, alg);
		
	}
	async verifyJWT(jwt, publicKey) {
		console.log('jwt', jwt)
		console.log('public key', publicKey)
		try {
			const result = await Jose.jwtVerify(jwt, publicKey);
			console.log('result', result)
			return result.payload;
		} catch (err) {
			return false;
		}
	}
}