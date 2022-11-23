import { Injectable, Logger } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { azAppSettings } from '../azure/azure-application-settings';

const nodemailer = require('nodemailer');
const mjml2html = require('mjml');

@Injectable()
export class EmailsService {
	private logger = new Logger(EmailsService.name);
	
	private options: SMTPTransport.Options = {
		host: azAppSettings.TUEBI_EMAIL_HOST,
		port: Number(azAppSettings.TUEBI_EMAIL_PORT),
		secure: true,
		auth: {
			user: azAppSettings.TUEBI_EMAIL_NO_REPLY_ADDRESS,
			pass: azAppSettings.TUEBI_EMAIL_NO_REPLY_PASSWORD,
		},
	};
	
	async sendEmail(emailOptions: Mail.Options) {
		try {
			const transporter = nodemailer.createTransport(this.options);
			return await transporter.sendMail(emailOptions);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async genSignupConfirmationEmail(
		userConfirmationCode: string,
		expireMinutes: number
	) {
		try {
			const year = new Date().getFullYear();
			const {html} = mjml2html(`
      <mjml>
        <mj-body background-color="#ebebeb">
          <mj-section padding="1rem">
            <mj-column background-color="#fff" border-radius="1rem" padding="1rem" width="100%">
              <!-- <mj-image width="100px" src=""></mj-image> -->
      
              <mj-text font-weight="800" font-size="20px" color="#212529" line-height="2">
                Thank you for signing up!
              </mj-text>
      
              <mj-text font-size="16px" color="#343a40" line-height="2">
                Only one more step to complete your registration. Here is your verification code:
              </mj-text>
              <mj-text font-size="16px" color="#343a40" line-height="2">The confirmation will expire in ${expireMinutes} minutes for security reasons. If this wasn't you, please ignore this email.</mj-text>
              <mj-text font-size="30px">${userConfirmationCode}</mj-text>
      
              <mj-text font-size="16px" color="#343a40">Sincerely</mj-text>
              <mj-text font-size="16px" color="#343a40">Tuebi.io</mj-text>
      
            </mj-column>
          </mj-section>
      
          <mj-section>
            <mj-text align="center" color="#6c757d" line-height="2">
              Please do not reply to this email. Emails sent to this address will not be answered.
            </mj-text>
            <mj-text align="center" color="#6c757d" line-height="2">
              Copyright © ${year}-${year + 1} Tuebi.io
            </mj-text>
          </mj-section>
        </mj-body>
      </mjml>
    `);
			return html;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async genResetPasswordEmail(confirmationCode: string) {
		try {
			const FRONT_END_URL = azAppSettings.TUEBI_FRONTEND_URL + 'pw/reset';
			const year = new Date().getFullYear();
			const {html} = mjml2html(`
			  <mjml>
				<mj-body background-color="#ebebeb">
				  <mj-section padding="1rem">
					<mj-column background-color="#fff" border-radius="1rem" padding="1rem" width="100%">
					  <!-- <mj-image width="80px" height="80px" src=""></mj-image> -->
					  <mj-text font-weight="800" font-size="20px" color="#212529" line-height="2">
						We've received your request
					  </mj-text>
			  
					  <mj-text font-size="16px" color="#343a40" line-height="2">
						Now you can reset your password! Please click the button and use the confirmation code below.
					  </mj-text>
					  
					  <mj-text font-size="30px">${confirmationCode}</mj-text>
					  
					  <mj-button href="${FRONT_END_URL}">Reset Password</mj-button>
					  
					  <mj-text font-size="16px" color="#343a40" line-height="2">
					    If this wasn't you, you can ignore this email.
					  </mj-text>
					
					  <mj-text font-size="16px" color="#343a40">Sincerely</mj-text>
					  <mj-text font-size="16px" color="#343a40">Tuebi.io</mj-text>
			  
					</mj-column>
				  </mj-section>
			  
				  <mj-section>
					<mj-text align="center" color="#6c757d" line-height="2">
					  Please do not reply to this email. Emails sent to this address will not be answered.
					</mj-text>
					<mj-text align="center" color="#6c757d" line-height="2">
					  Copyright © ${year}-${year + 1} Tuebi.io
					</mj-text>
				  </mj-section>
				</mj-body>
			  </mjml>
			`);
			return html;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
	
	async generateConfirmationCode() {
		try {
			const LENGTH = 6;
			const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
			
			let str = '';
			for (let i = 0; i < LENGTH; i++) {
				const randomGeneratorIndex = Math.floor(Math.random() * 2);
				if (randomGeneratorIndex === 0) {
					const randomCharacter =
						ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
					str += randomCharacter;
				} else {
					const randomNumber = Math.floor(Math.random() * 10);
					str += randomNumber;
				}
			}
			return str.toUpperCase();
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
}
