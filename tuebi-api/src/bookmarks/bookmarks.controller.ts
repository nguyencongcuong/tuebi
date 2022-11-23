import { SqlQuerySpec } from '@azure/cosmos';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Request,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { groupBy, isEmpty, transform } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatchPayload } from '../azure/az-db.service';
import { azAppSettings } from '../azure/azure-application-settings';
import { CategoriesService } from '../categories/categories.service';
import { SecurityService } from '../security/security.service';
import { bookmarkHtmlToJson, sendError, sendSuccess } from '../utilities';
import { Bookmark, CreateBookmarkRequestBodyI, UpdateBookmarkQueryI, } from './bookmarks.interface';
import { BookmarksService } from './bookmarks.service';

@Controller()
export class BookmarksController {
	private ENCRYPTED_FIELDS = [
		'bookmark_tags',
		'bookmark_name',
		'bookmark_url',
		'bookmark_description',
		'tag_name',
	];
	
	constructor(
		private categoriesService: CategoriesService,
		private bookmarksService: BookmarksService,
		private authService: AuthService,
		private securityService: SecurityService,
	) {
	}
	
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	@Post('bookmarks/import')
	async import(
		@Request() req: any,
		@UploadedFile() fileBuffer: Express.Multer.File
	) {
		try {
			const bearerToken = req.headers.authorization;
			const fileString = fileBuffer.buffer.toString();
			const bookmarks = await bookmarkHtmlToJson(fileString);
			const groupedBookmarks = groupBy(bookmarks, (item) => item.category_name);
			
			// Call request to our server controllers so that I don't need to write handling function one more time
			for (const categoryName of Object.keys(groupedBookmarks)) {
				const newCategory = {category_name: categoryName};
				const options = {
					headers: {
						Authorization: bearerToken,
					},
				};
				const createCategoryUrl = `${azAppSettings.TUEBI_BACKEND_URL}/categories`;
				const createBookmarkUrl = `${azAppSettings.TUEBI_BACKEND_URL}/bookmarks`;
				
				const res = await axios.post(createCategoryUrl, newCategory, options);
				
				if (res.data.success) {
					const category = res.data.data;
					
					for (const bookmark of groupedBookmarks[categoryName]) {
						const newBookmark = {...bookmark, category_id: category.id};
						await axios.post(createBookmarkUrl, newBookmark, options);
					}
				}
			}
			
			return sendSuccess('Bookmarks imported successfully!');
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('bookmarks')
	async createOne(
		@Request() req: any,
		@Body() bookmark: CreateBookmarkRequestBodyI
	) {
		try {
			const bearerToken = req.headers.authorization;
			const user = await this.authService.getUserByJwtToken(bearerToken);
			
			if (isEmpty(bookmark)) {
				return sendError('Your input is invalid');
			}
			
			const payload: Bookmark = {
				user_id: user.id,
				partition_key: user.id,
				bookmark_created_time: new Date().toISOString(),
				bookmark_last_modified_time: new Date().toISOString(),
				bookmark_deleted: false,
				bookmark_order: 0,
				...bookmark,
			};
			
			const encryptedItem: Bookmark = await this.securityService.encryptObject(
				payload,
				Buffer.from(user._iv, 'hex'),
				this.ENCRYPTED_FIELDS
			);
			
			const data = await this.bookmarksService.createOne(encryptedItem);
			
			const decryptedItem = await this.securityService.decryptObject(
				data,
				user._iv,
				this.ENCRYPTED_FIELDS
			);
			
			return sendSuccess(decryptedItem);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('bookmarks/:id')
	async readOne(@Param('id') id: string, @Request() req: any) {
		try {
			const bearerToken = req.headers.authorization;
			const user = await this.authService.getUserByJwtToken(bearerToken);
			
			const data = await this.bookmarksService.readOne(id, user.id);
			
			const decryptedData = await this.securityService.decryptObject(
				data,
				user._iv,
				this.ENCRYPTED_FIELDS
			);
			
			return sendSuccess(decryptedData);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('bookmarks')
	async readAll(@Request() req: any) {
		try {
			const bearerToken = req.headers.authorization;
			const user = await this.authService.getUserByJwtToken(bearerToken);
			
			const query: SqlQuerySpec = {
				query: 'SELECT * FROM c WHERE c.user_id = @userId',
				parameters: [
					{
						name: '@userId',
						value: user.id,
					},
				],
			};
			
			const data = await this.bookmarksService.readMany(query);
			
			const decryptedData = await this.securityService.decryptArray(
				data,
				user._iv,
				this.ENCRYPTED_FIELDS
			);
			return sendSuccess(decryptedData);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Put('bookmarks/:id')
	async updateOne(@Request() req: any, @Param('id') id: string) {
		try {
			const bearerToken = req.headers.authorization;
			const updatedFields = req.body;
			const user = await this.authService.getUserByJwtToken(bearerToken);
			
			const doc: UpdateBookmarkQueryI = {
				...updatedFields,
				bookmark_last_modified_time: new Date().toISOString(),
			};
			
			const encryptedData = await this.securityService.encryptObject(
				doc,
				Buffer.from(user._iv, 'hex'),
				this.ENCRYPTED_FIELDS
			);
			
			const operations = transform(
				encryptedData,
				(result, value, key) => {
					result.push({
						op: 'add',
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
			
			const data = await this.bookmarksService.updateOne(patchPayload);
			
			const decryptedData = await this.securityService.decryptObject(
				data,
				user._iv,
				this.ENCRYPTED_FIELDS
			);
			
			return sendSuccess(decryptedData);
		} catch (e) {
			return sendError(e);
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Delete('bookmarks/:id')
	async deleteOne(@Request() req: any, @Param('id') id: string) {
		try {
			const bearerToken = req.headers.authorization;
			const user = await this.authService.getUserByJwtToken(bearerToken);
			await this.bookmarksService.deleteOne(id, user.id);
			return sendSuccess();
		} catch (e) {
			return sendError(e);
		}
	}
}