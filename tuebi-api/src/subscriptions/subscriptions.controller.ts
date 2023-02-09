import { SqlQuerySpec } from '@azure/cosmos';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, } from '@nestjs/common';
import { transform } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { AzureB2cJwt } from '../auth/guards/azure-b2c-jwt';
import { PatchPayload } from '../azure/az-db.service';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { UsersService } from '../users/users.service';
import { sendError, sendSuccess } from '../utilities';
import { Subscription } from './subscriptions.interface';
import { SubscriptionsService } from './subscriptions.service';

@Controller()
export class SubscriptionsController {
	constructor(
		private subscriptionService: SubscriptionsService,
		private authService: AuthService,
		private usersService: UsersService,
	) {}
	
	@Roles(Role.Admin)
	@Post('subscriptions')
	async createOne(@Body() subscription: Subscription) {
		try {
			const data = await this.subscriptionService.createOne(subscription);
			return sendSuccess(data);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(AzureB2cJwt)
	@Get('subscriptions')
	async readAll(@Request() req: any) {
		try {
			if (req.user) {
				const querySpec: SqlQuerySpec = {
					query: 'SELECT * FROM c',
				};
				const subscriptions = await this.subscriptionService.readMany(querySpec);
				return sendSuccess(subscriptions);
			} else {
				return sendError('No user match your authorization credential');
			}
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Roles(Role.Admin)
	@Put('subscriptions/:id')
	async updateOne(@Param('id') id: string, @Body() subscription: Subscription) {
		try {
			const patchPayload: PatchPayload = {
				id: id,
				partition_key: '',
				operations: transform(
					subscription,
					(result, value, key) => {
						result.push({op: 'add', path: `/${key}`, value: value});
					},
					[]
				),
			};
			const data = await this.subscriptionService.updateOne(patchPayload);
			return sendSuccess(data);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Roles(Role.Admin)
	@Delete('subscriptions/:id')
	async deleteOne(@Param('id') id: string) {
		try {
			await this.subscriptionService.deleteOne(id, '');
			return sendSuccess();
		} catch (e) {
			return sendError(e);
		}
	}
}
