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
import { AzureB2cJwt } from '../auth/guards/azure-b2c-jwt';
import { PatchPayload } from '../azure/az-db.service';
import { CategoriesService } from '../categories/categories.service';
import { SecurityService } from '../security/security.service';
import { bookmarkHtmlToJson, runBatchAsync, sendError, sendSuccess } from '../utilities';
import {
  Bookmark,
  CreateBookmarkRequestBodyI,
  DeleteBookmarksRequestBodyI,
  UpdateBookmarkQueryI,
  UpdateBookmarksRequestBodyI,
} from './bookmarks.interface';
import { BookmarksService } from './bookmarks.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class BookmarksController {
  private ENCRYPTED_FIELDS = [
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
    private configService: ConfigService,
  ) {
  }
  
  @UseGuards(AzureB2cJwt)
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
        const createCategoryUrl = `${this.configService.get('TUEBI_BACKEND_URL')}/categories`;
        const createBookmarkUrl = `${this.configService.get('TUEBI_BACKEND_URL')}/bookmarks`;
        
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
  
  @UseGuards(AzureB2cJwt)
  @Post('bookmarks')
  async createOne(
    @Request() req: any,
    @Body() bookmark: CreateBookmarkRequestBodyI
  ) {
    const user = req.user;
    
    try {
      if (isEmpty(bookmark)) {
        return sendError('Your input is invalid');
      }
      
      const now = Math.floor(Date.now() / 1000);
      
      const payload: Bookmark = {
        user_id: user.id,
        partition_key: user.id,
        bookmark_created_time: now,
        bookmark_last_modified_time: now,
        bookmark_deleted: false,
        bookmark_order: 0,
        bookmark_tags: [],
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
  
  @UseGuards(AzureB2cJwt)
  @Get('bookmarks/:id')
  async readOne(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    
    try {
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
  
  @UseGuards(AzureB2cJwt)
  @Get('bookmarks')
  async readAll(@Request() req: any) {
    const user = req.user;
    
    try {
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
  
  @UseGuards(AzureB2cJwt)
  @Put('bookmarks/:id')
  async updateOne(@Request() req: any, @Param('id') id: string) {
    const user = req.user;
    
    try {
      const updatedFields = req.body;
      const now = Math.floor(Date.now() / 1000);
      
      const doc: UpdateBookmarkQueryI = {
        ...updatedFields,
        bookmark_last_modified_time: now,
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
  
  @UseGuards(AzureB2cJwt)
  @Put('bookmarks')
  async updateMany(@Request() req: any, @Body() body: UpdateBookmarksRequestBodyI) {
    const user = req.user;
    
    try {
      const now = Math.floor(Date.now() / 1000);
  
      const promise = async (bookmark: Bookmark) => {
        const doc = {...bookmark, bookmark_last_modified_time: now };
        
        delete doc.id
        delete doc.partition_key;
        
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
          id: bookmark.id,
          partition_key: user.id,
          operations: operations,
        };
        return this.bookmarksService.updateOne(patchPayload);
      }
      
      await runBatchAsync(body, promise);
      return sendSuccess();
    } catch (e) {
      return sendError(e);
    }
  }
  
  @UseGuards(AzureB2cJwt)
  @Delete('bookmarks/:id')
  async deleteOne(@Request() req: any, @Param('id') id: string) {
    const user = req.user;
    try {
      await this.bookmarksService.deleteOne(id, user.id);
      return sendSuccess();
    } catch (e) {
      return sendError(e);
    }
  }
  
  @UseGuards(AzureB2cJwt)
  @Delete('bookmarks')
  async deleteMany(@Request() req: any, @Body() body: DeleteBookmarksRequestBodyI) {
    const user = req.user;
    try {
      const callback = (id: string) => this.bookmarksService.deleteOne(id, user.id);
      await runBatchAsync(body.bookmarks, callback);
      return sendSuccess();
    } catch (e) {
      return sendError(e);
    }
  }
}