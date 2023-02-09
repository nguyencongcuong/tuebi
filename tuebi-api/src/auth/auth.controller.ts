import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { sendSuccess } from '../utilities';
import { AzureB2cJwt } from './guards/azure-b2c-jwt';

@Controller('auth')
export class AuthController {
	constructor(
	) {}
	
	// For Testing
	@UseGuards(AzureB2cJwt)
	@Get('jwt-validation')
	async validateJWT(@Request() req: any) {
		// If the JWT can pass the @UseGuards, it will return { success: true }
		// If the JWT cannot pass the @UseGuards, it will return { "statusCode": 401, "message": "Unauthorized" }
		return sendSuccess(req.user)
	}
}