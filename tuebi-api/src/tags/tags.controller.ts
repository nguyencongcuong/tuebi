import { SqlQuerySpec } from '@azure/cosmos';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { indexOf, transform } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { AzureB2cJwt } from '../auth/guards/azure-b2c-jwt';
import { Bookmark } from '../bookmarks/bookmarks.interface';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { SecurityService } from '../security/security.service';
import { sendError, sendSuccess } from '../utilities';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  private ENCRYPTED_FIELDS = [
    'tag_name',
  ];
  
  constructor(
    private authService: AuthService,
    private securityService: SecurityService,
    private tagsService: TagsService,
    private bookmarksService: BookmarksService
  ) {}
  
  @UseGuards(AzureB2cJwt)
  @Post()
  async createOne(
    @Request() req: any,
    @Body() createTagDto: CreateTagDto
  ) {
    const user = req.user;
    
    try {
      const payload: Tag = {
        partition_key: user.id,
        tag_name: createTagDto.tag_name,
        tag_color: createTagDto?.tag_color || '#CFD8DC',
        tag_created_time: new Date().toISOString(),
        tag_last_modified_time: new Date().toISOString()
      };
      
      const encryptedItem: Tag = await this.securityService.encryptObject(
        payload,
        Buffer.from(user._iv, 'hex'),
        this.ENCRYPTED_FIELDS
      );
      
      const data = await this.tagsService.createOne(encryptedItem);
      
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
  @Get()
  async readAll(@Request() req: any) {
    const user = req.user;
    
    try {
      const query: SqlQuerySpec = {
        query: 'SELECT * FROM c WHERE c.partition_key = @userId',
        parameters: [
          {
            name: '@userId',
            value: user.id
          }
        ]
      };
      
      const data = await this.tagsService.readMany(query);
      
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
  @Get(':id')
  async readOne(@Request() req: any, @Param('id') id: string) {
    const user = req.user;
    
    try {
      const data = await this.tagsService.readOne(id, user.id);
      
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
  @Put(':id')
  async updateOne(@Request() req: any, @Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const user = req.user;
    
    try {
      const updatedFields = req.body;
      
      const doc: UpdateTagDto = {
        ...updatedFields,
        tag_last_modified_time: new Date().toISOString(),
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
      
      const data = await this.tagsService.updateOne(id, user.id, operations);
      
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
  @Delete(':id')
  async deleteOne(@Request() req: any, @Param('id') id: string) {
    const user = req.user;
    
    try {
      const querySpec: SqlQuerySpec = {
        query: `
          SELECT c.id, c.bookmark_tags FROM c
          WHERE ARRAY_CONTAINS(c.bookmark_tags, @id)
        `,
        parameters: [
          {
            name: '@id',
            value: id
          }
        ]
      };
      
      const bookmarks = await this.bookmarksService.readMany<Bookmark>(querySpec);
      
      if (bookmarks.length) {
        for (const bookmark of bookmarks) {
          const index = indexOf(bookmark.bookmark_tags, id);
          await this.bookmarksService.updateOne({
            id: bookmark.id,
            partition_key: user.id,
            operations: [
              {
                op: 'remove',
                path: `/bookmark_tags/${index}`,
              }
            ]
          });
        }
      }
      
      await this.tagsService.deleteOne(id, user.id);
      return sendSuccess();
    } catch (e) {
      return sendError(e);
    }
  }
}
