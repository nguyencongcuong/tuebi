import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { azAppSettings } from '../../azure/azure-application-settings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: azAppSettings.SECRET_JWT_TOKEN_KEY
		});
	}
	
	async validate(payload: any) {
		return {...payload.user};
	}
}