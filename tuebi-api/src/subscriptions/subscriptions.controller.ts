import { SqlQuerySpec } from '@azure/cosmos';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, } from '@nestjs/common';
import { transform } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatchPayload } from '../azure/az-db.service';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { sendError, sendSuccess } from '../utilities';
import { Subscription } from './subscriptions.interface';
import { SubscriptionsService } from './subscriptions.service';

@Controller()
export class SubscriptionsController {
	constructor(
		private subscriptionService: SubscriptionsService,
		private authService: AuthService
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
	
	@UseGuards(JwtAuthGuard)
	@Get('subscriptions')
	async readAll(@Request() req: any) {
		try {
			const bearerToken = req.headers.authorization;
			const user = await this.authService.getUserByJwtToken(bearerToken);
			
			if (user) {
				const querySpec: SqlQuerySpec = {
					query: 'SELECT * FROM c',
				};
				const subscriptions = await this.subscriptionService.readMany(
					querySpec
				);
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
