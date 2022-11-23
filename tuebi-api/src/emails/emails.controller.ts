import { Body, Controller, Post } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { sendError, sendSuccess } from '../utilities';
import { EmailsService } from './emails.service';

@Controller()
export class EmailsController {
	constructor(
		private emailService: EmailsService
	) {
	}
	
	@Post('email')
	async sendEmailViaSMTP(@Body() emailOptions: Mail.Options) {
		try {
			const data = await this.emailService.sendEmail(emailOptions);
			return sendSuccess(data);
		} catch (e) {
			return sendError(e);
		}
	}
}