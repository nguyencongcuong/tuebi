import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { azAppSettings } from '../azure/azure-application-settings';
import { SecurityService } from '../security/security.service';
import { AuthedUserI, User, UserLoginRequestBodyI, } from '../users/users.interface';
import { UsersService } from '../users/users.service';
import { DecodedJwtI, JwtI } from './auth.interface';

@Injectable()
export class AuthService {
	private SECRET_JWT_TOKEN_KEY = azAppSettings.SECRET_JWT_TOKEN_KEY;
	private logger = new Logger(AuthService.name);
	
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private securityService: SecurityService
	) {}
	
	async parseJwtToken(jwtToken: string): Promise<DecodedJwtI> {
		try {
			const tokenArray = jwtToken.split('Bearer ');
			const token = tokenArray[tokenArray.length - 1];
			return this.jwtService.decode(token) as DecodedJwtI;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async getUserByJwtToken(jwtToken: string): Promise<User> {
		try {
			const decodedUser = await this.parseJwtToken(jwtToken);
			return await this.usersService.readOne(decodedUser.id, '');
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	generateJwt(userId: string, userEmail: string): JwtI {
		try {
			const EXPIRE_TIME = '7 days';
			const options: JwtSignOptions = {
				secret: this.SECRET_JWT_TOKEN_KEY,
				expiresIn: EXPIRE_TIME,
			};
			const token = this.jwtService.sign(
				{id: userId, user_email: userEmail},
				options
			);
			return {
				access_token: token,
				token_type: 'JWT',
				expired_in: EXPIRE_TIME,
			};
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async login(userLogin: UserLoginRequestBodyI): Promise<AuthedUserI | false> {
		try {
			const querySpec = {
				query:
					'SELECT * FROM c WHERE c.user_email = @userEmail AND c.user_is_confirmed = @confirmed',
				parameters: [
					{
						name: '@userEmail',
						value: userLogin.user_email,
					},
					{
						name: '@confirmed',
						value: true,
					},
				],
			};
			
			const user: User = (await this.usersService.readMany(querySpec))[0];
			
			if (!user.user_is_confirmed) {
				return false;
			}
			
			if (user) {
				const isPasswordCorrect = this.securityService.compareHash(
					userLogin.user_password,
					user.user_password
				);
				if (isPasswordCorrect) {
					const jwt = this.generateJwt(user.id, user.user_email);
					return {
						id: user.id,
						user_email: user.user_email,
						user_roles: user.user_roles,
						access_token: jwt.access_token,
						token_type: jwt.token_type,
						expired_in: jwt.expired_in,
					};
				} else {
					return false;
				}
			}
			
			return false;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
}