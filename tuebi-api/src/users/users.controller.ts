import { PatchOperation, SqlQuerySpec } from '@azure/cosmos';
import { Body, Controller, Delete, Get, Post, Put, Query, Request, UseGuards, } from '@nestjs/common';

import { randomBytes } from 'crypto';
import { transform } from 'lodash';
import Mail from 'nodemailer/lib/mailer';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatchPayload } from '../azure/az-db.service';
import { azAppSettings } from '../azure/azure-application-settings';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Category } from '../categories/categories.interface';
import { CategoriesService } from '../categories/categories.service';
import { EmailsService } from '../emails/emails.service';
import { SecurityService } from '../security/security.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { sendError, sendSuccess } from '../utilities';
import { CreateUserRequestBodyI, UpdateUserRequestBodyI, User, } from './users.interface';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
	TUEBI_EMAIL_NO_REPLY_NAME = azAppSettings.TUEBI_EMAIL_NO_REPLY_NAME;
	TUEBI_EMAIL_NO_REPLY_ADDRESS = azAppSettings.TUEBI_EMAIL_NO_REPLY_ADDRESS;
	CONFIRMATION_TIME_OUT = 1000 * 60 * 5;
	private ENCRYPTED_FIELDS = ['user_name'];
	
	constructor(
		private userService: UsersService,
		private emailService: EmailsService,
		private authService: AuthService,
		private subscriptionService: SubscriptionsService,
		private securityService: SecurityService,
		private bookmarksService: BookmarksService,
		private categoriesService: CategoriesService
	) {}
	
	@Post('users')
	async createOne(@Body() user: CreateUserRequestBodyI) {
		try {
			// Check if user_email is existed
			const querySpec = {
				query: 'SELECT * FROM c WHERE c.user_email = @userEmail',
				parameters: [
					{
						name: '@userEmail',
						value: user.user_email,
					},
				],
			};
			
			const isExisted = (await this.userService.readMany(querySpec))[0];
			
			if (isExisted && isExisted.user_is_confirmed) {
				return sendError('User existed!');
			}
			
			// Initialize user
			const date = new Date().toISOString();
			
			const confirmationCode =
				await this.emailService.generateConfirmationCode();
			const hashedPassword = this.securityService.hash(user.user_password);
			
			const ivBuffer = randomBytes(16);
			const ivString = ivBuffer.toString('hex');
			
			const payload: User = {
				...user,
				partition_key: '',
				user_password: hashedPassword,
				user_created_time: date,
				user_last_modified_time: date,
				user_last_active_time: date,
				user_is_confirmed: false,
				user_confirmation_code: confirmationCode,
				user_roles:
					user.user_email === 'cuongnc.fe@gmail.com'
						? ['user', 'admin']
						: ['user'],
				user_subscription_id: '',
				user_name: '',
				user_settings: {
					is_compact_mode_on: false,
					is_favicon_shown: true,
					is_bookmark_url_shorten: false,
					is_bookmark_count_shown: true,
					is_bookmark_url_shown: true,
				},
				_iv: ivString,
			};
			
			// Send email to the user with confirmation code
			const expireMinutes = this.CONFIRMATION_TIME_OUT / 1000 / 60;
			const html = await this.emailService.genSignupConfirmationEmail(
				confirmationCode,
				expireMinutes
			);
			
			const emailOptions: Mail.Options = {
				from: `${this.TUEBI_EMAIL_NO_REPLY_NAME} <${this.TUEBI_EMAIL_NO_REPLY_ADDRESS}>`,
				to: user.user_email,
				subject: `Verify Your ${this.TUEBI_EMAIL_NO_REPLY_NAME} Email Address.`,
				html,
			};
			
			await this.emailService.sendEmail(emailOptions);
			
			const data = await this.userService.createOne(payload);
			
			return sendSuccess(data);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Get('users/confirmation')
	async confirmOne(
		@Query() query: { user_email: string; user_confirmation_code: string }
	) {
		try {
			const querySpec = {
				query:
					'SELECT * FROM c WHERE c.user_email = @userEmail AND c.user_confirmation_code = @userConfirmationCode',
				parameters: [
					{
						name: '@userEmail',
						value: query.user_email,
					},
					{
						name: '@userConfirmationCode',
						value: query.user_confirmation_code,
					},
				],
			};
			
			const user = (await this.userService.readMany(querySpec))[0];
			
			if (user) {
				const newUser = {
					user_email: query.user_email,
					user_password: user.user_password,
					user_is_confirmed: true,
					user_confirmation_code: '',
					user_created_time: new Date().toISOString(),
					user_last_modified_time: new Date().toISOString(),
					user_roles: user.user_roles,
				};
				
				const encryptedUser = await this.securityService.encryptObject(
					newUser,
					Buffer.from(user._iv, 'hex'),
					this.ENCRYPTED_FIELDS
				);
				
				const patchOperations: PatchOperation[] = [
					{
						op: 'add',
						path: '/user_is_confirmed',
						value: encryptedUser.user_is_confirmed,
					},
					{
						op: 'add',
						path: '/user_confirmation_code',
						value: encryptedUser.user_confirmation_code,
					},
					{
						op: 'add',
						path: '/user_created_time',
						value: encryptedUser.user_created_time,
					},
					{
						op: 'add',
						path: '/user_last_modified_time',
						value: encryptedUser.user_last_modified_time,
					},
					{
						op: 'add',
						path: '/user_roles',
						value: encryptedUser.user_roles,
					},
				];
				
				const patchPayload: PatchPayload = {
					id: user.id,
					partition_key: user.partition_key,
					operations: patchOperations,
				};
				
				const result = await this.userService.updateOne(patchPayload);
				
				return sendSuccess(result);
			}
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Get('users/pw/reset')
	async sendPasswordResetEmail(@Query('user_email') userEmail: string) {
		try {
			const querySpec: SqlQuerySpec = {
				query: 'SELECT * FROM c WHERE c.user_email = @userEmail',
				parameters: [
					{
						name: '@userEmail',
						value: userEmail,
					},
				],
			};
			
			const encryptedUsers = await this.userService.readMany(querySpec);
			
			if (!encryptedUsers.length) {
				return sendError(
					`User email <strong>${userEmail}</strong> is not existed in the system.`
				);
			}
			
			// As Email is unique identifier, I can use this method to get the user I need.
			const encryptedUser = encryptedUsers[0];
			
			// Generate a new password and hash it. Update this hashed password into the database
			const confirmationCode = await this.securityService.randomCode(6);
			
			// Send reset password email
			const html = await this.emailService.genResetPasswordEmail(
				confirmationCode
			);
			
			const emailOptions: Mail.Options = {
				from: `${this.TUEBI_EMAIL_NO_REPLY_NAME} <${this.TUEBI_EMAIL_NO_REPLY_ADDRESS}>`,
				to: userEmail,
				subject: `Reset Your ${this.TUEBI_EMAIL_NO_REPLY_NAME} Account Password.`,
				html,
			};
			
			await this.emailService.sendEmail(emailOptions);
			
			// Update confirmation code into the database
			await this.userService.updateOne({
				id: encryptedUser.id,
				partition_key: '',
				operations: [
					{
						op: 'replace',
						path: '/user_confirmation_code',
						value: confirmationCode,
					},
				],
			});
			
			return sendSuccess();
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Put('users/pw/update')
	async resetPassword(
		@Body()
			body: {
			user_email: string;
			user_confirmation_code: string;
			user_updated_password: string;
			user_confirmed_password: string;
		}
	) {
		try {
			// Query to find user by email
			const querySpec: SqlQuerySpec = {
				query:
					'SELECT * FROM c WHERE c.user_email = @userEmail AND c.user_confirmation_code = @userConfirmationCode',
				parameters: [
					{
						name: '@userEmail',
						value: body.user_email,
					},
					{
						name: '@userConfirmationCode',
						value: body.user_confirmation_code,
					},
				],
			};
			
			const encryptedUsers = await this.userService.readMany(querySpec);
			
			if (!encryptedUsers.length) {
				return sendError('Your information is not match with our database.');
			}
			
			const encryptedUser = encryptedUsers[0];
			
			// Update Password
			const newHashedPassword = this.securityService.hash(
				body.user_updated_password
			);
			await this.userService.updateOne({
				id: encryptedUser.id,
				partition_key: encryptedUser.partition_key,
				operations: [
					{
						op: 'replace',
						path: '/user_password',
						value: newHashedPassword,
					},
					{
						op: 'replace',
						path: '/user_confirmation_code',
						value: '',
					},
				],
			});
			
			return sendSuccess();
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('users')
	async readOne(@Request() req: any) {
		try {
			const bearerToken = req.headers.authorization;
			const decoded = await this.authService.parseJwtToken(bearerToken);
			const encryptedUser = await this.userService.readOne(decoded.id, '');
			const decryptedUser = await this.securityService.decryptObject(
				encryptedUser,
				encryptedUser._iv,
				this.ENCRYPTED_FIELDS
			);
			
			if (decryptedUser) {
				delete decryptedUser['user_password'];
				delete decryptedUser['user_confirmation_code'];
				return sendSuccess(decryptedUser);
			} else {
				return sendError('User not found!');
			}
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Put('users')
	async updateOne(@Request() req: any, @Body() user: UpdateUserRequestBodyI) {
		try {
			const bearerToken = req.headers.authorization;
			
			// Check if user password is correct
			const currentUser = await this.authService.getUserByJwtToken(bearerToken);
			
			if (user.user_password) {
				const isMatched = this.securityService.compareHash(
					user.user_password,
					currentUser.user_password
				);
				if (!isMatched) {
					return sendError('The password is not correct.');
				}
			}
			
			// If there's user_updated_password, update user_password
			let updatedUser;
			if (user.user_updated_password) {
				updatedUser = {
					...user,
					user_password: this.securityService.hash(user.user_updated_password),
					user_last_modified_time: new Date().toISOString(),
				};
				delete updatedUser.user_updated_password;
			} else {
				updatedUser = {
					...user,
					user_last_modified_time: new Date().toISOString(),
				};
			}
			
			// Update user
			const encrypted = await this.securityService.encryptObject(
				updatedUser,
				Buffer.from(currentUser._iv, 'hex'),
				this.ENCRYPTED_FIELDS
			);
			
			const patchPayload: PatchPayload = {
				id: currentUser.id,
				partition_key: currentUser.partition_key,
				operations: transform(
					encrypted,
					(result, value, key) => {
						result.push({op: 'add', path: '/' + String(key), value: value});
					},
					[]
				),
			};
			const data = await this.userService.updateOne(patchPayload);
			
			const decrypted = await this.securityService.decryptObject(
				data,
				currentUser._iv,
				this.ENCRYPTED_FIELDS
			);
			
			return sendSuccess(decrypted);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Delete('users')
	async deleteOne(@Request() req: any) {
		try {
			const bearerToken = req.headers.authorization;
			const decoded = await this.authService.parseJwtToken(bearerToken);
			
			// Delete an user means deleting all categories and all bookmarks
			const querySpec: SqlQuerySpec = {
				query: 'SELECT c.id, c.partition_key FROM c',
			};
			
			const bookmarks = await this.bookmarksService.readMany<{ id: string; partition_key: string; }>(querySpec);
			
			if (bookmarks.length) {
				for (const item of bookmarks) {
					await this.bookmarksService.deleteOne(item.id, item.partition_key);
				}
			}
			
			const categories = await this.categoriesService.readMany<Category>(querySpec);
			
			if (categories.length) {
				for (const item of categories) {
					await this.categoriesService.deleteOne(item.id, item.partition_key);
				}
			}
			
			await this.userService.deleteOne(decoded.id, '');
			
			return sendSuccess();
		} catch (e) {
			return sendError(e);
		}
	}
}
