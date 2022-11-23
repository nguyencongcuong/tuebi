import { Body, Controller, Post } from '@nestjs/common';
import { UserLoginRequestBodyI } from '../users/users.interface';
import { sendError, sendSuccess } from '../utilities';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	
	@Post('login')
	async login(@Body() userLogin: UserLoginRequestBodyI) {
		try {
			const authedUser = await this.authService.login(userLogin);
			
			if (!authedUser) {
				return sendError('Your username/password is incorrect.');
			}
			
			return sendSuccess(authedUser);
		} catch (e) {
			return sendError(e);
		}
	}
}
