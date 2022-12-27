import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLoginRequestBodyI } from '../users/users.interface';
import { UsersService } from '../users/users.service';
import { sendError, sendSuccess } from '../utilities';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private userService: UsersService,
		private authService: AuthService
	) {}
	
	@Post('login')
	async login(@Body() userLogin: UserLoginRequestBodyI) {
		try {
			const authedUser = await this.authService.login(userLogin);
			
			if (!authedUser) {
				return sendError('Your username/password is incorrect.');
			}
			
			const user = await this.userService.readOne(authedUser.id, '')
			
			await this.userService.updateOne({
				id: user.id,
				operations: [
					{
						op: 'add',
						value: new Date().toISOString(),
						path: '/user_last_active_time'
					}
				],
				partition_key: user.partition_key
			})
			
			return sendSuccess(authedUser);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('jwt-validation')
	async validateJWT(@Request() req: any) {
		// If the JWT can pass the @UseGuards, it will return { success: true }
		// If the JWT cannot pass the @UseGuards, it will return { "statusCode": 401, "message": "Unauthorized" }
		return sendSuccess()
	}
}