import { PatchOperation, SqlQuerySpec } from '@azure/cosmos';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { isEmpty, transform } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { AzureB2cJwt } from '../auth/guards/azure-b2c-jwt';
import { PatchPayload } from '../azure/az-db.service';
import { SecurityService } from '../security/security.service';
import { sendError, sendSuccess } from '../utilities';
import { Category, CreateCategoryQueryI, UpdateCategoryQueryI, } from './categories.interface';

import { CategoriesService } from './categories.service';

@Controller()
@UseGuards(AzureB2cJwt)
export class CategoriesController {
	private ENCRYPTED_FIELDS = ['category_name'];
	
	constructor(
		private categoriesService: CategoriesService,
		private authService: AuthService,
		private securityService: SecurityService,
	) {}
	
	// CATEGORY
	@Post('categories')
	async createOne(@Body() category: CreateCategoryQueryI, @Request() req: any) {
		const user = req.user;
		
		try {
			if (isEmpty(category)) {
				return sendError('No category item provided');
			}
			
			const total = await this.categoriesService.readMany<number>({
				query: `
					SELECT VALUE COUNT(1) FROM c
					WHERE c.partition_key = @userId
				`,
				parameters: [
					{
						name: '@userId',
						value: user.id
					}
				]
			})
			
			const payload: Category = {
				partition_key: user.id,
				user_id: user.id,
				category_name: category.category_name,
				category_created_time: new Date().toISOString(),
				category_last_modified_time: new Date().toISOString(),
				category_order: total[0] + 1,
				category_theme: category.category_theme || '',
			};
			
			const encrypted = await this.securityService.encryptObject(
				payload,
				Buffer.from(user._iv, 'hex'),
				this.ENCRYPTED_FIELDS
			);
			
			const data = await this.categoriesService.createOne(encrypted);
			
			const decrypted = await this.securityService.decryptObject(
				data,
				user._iv,
				this.ENCRYPTED_FIELDS
			);
			
			return sendSuccess(decrypted);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Get('categories/:id')
	async readOne(@Request() req: any, @Param('id') id: string) {
		const user = req.user;
		
		try {
			const data = await this.categoriesService.readOne(id, user.id);
			
			const decrypted = await this.securityService.decryptObject(
				data,
				user._iv,
				this.ENCRYPTED_FIELDS
			);
			return sendSuccess(decrypted);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Get('categories')
	async readAll(@Request() req: any) {
		try {
			const querySpec: SqlQuerySpec = {
				query: 'SELECT * FROM c WHERE c.user_id = @userId',
				parameters: [
					{
						name: '@userId',
						value: req.user.id,
					},
				],
			};
			
			const categories = await this.categoriesService.readMany(querySpec);
			
			const decrypted = await this.securityService.decryptArray(
				categories,
				req.user._iv,
				this.ENCRYPTED_FIELDS
			);
			
			return sendSuccess(decrypted);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Put('categories/:id')
	async updateOne(
		@Request() req: any,
		@Param('id') id: string,
		@Body() category: UpdateCategoryQueryI
	) {
		const user = req.user;
		
		try {
			const updatedCategory = {
				...category,
				category_last_modified_time: new Date().toISOString(),
			};
			
			const encrypted = await this.securityService.encryptObject(
				updatedCategory,
				Buffer.from(user._iv, 'hex'),
				this.ENCRYPTED_FIELDS
			);
			
			const operations: PatchOperation[] = transform(
				encrypted,
				(result, value, key) => {
					result.push({
						op: 'replace',
						path: `/${key}`,
						value: value,
					});
				},
				[]
			);
			
			const patchPayload: PatchPayload = {
				id: id,
				partition_key: user.id,
				operations: operations,
			};
			
			const data = await this.categoriesService.updateOne(patchPayload);
			
			const decrypted = await this.securityService.decryptObject(
				data,
				user._iv,
				this.ENCRYPTED_FIELDS
			);
			
			return sendSuccess(decrypted);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@Delete('categories/:id')
	async deleteOne(@Request() req: any, @Param('id') id: string) {
		const user = req.user;
		
		try {
			await this.categoriesService.deleteOne(id, user.id);
			return sendSuccess();
		} catch (e) {
			return sendError(e);
		}
	}
}
