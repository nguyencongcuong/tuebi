import { Controller, Logger, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureB2cJwt } from '../auth/guards/azure-b2c-jwt';
import { UsersService } from '../users/users.service';
import { sendError, sendSuccess } from '../utilities';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  private logger = new Logger(ImagesController.name);
  
  constructor(
    private readonly imagesService: ImagesService,
    private usersService: UsersService,
  ) {}
  
  @UseGuards(AzureB2cJwt)
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatar')
  async uploadAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const user = req.user;
      const url = await this.imagesService.upload(user.id, file.buffer);
      console.log('url, ', url)
      const data = {
        id: user.id,
        user_avatar_url: url,
      };
      this.usersService.updateOne({
        id: user.id,
        partition_key: '',
        operations: [
          {
            op: 'add',
            path: '/user_avatar_url',
            value: url,
          }
        ],
        
      })
      return sendSuccess(data);
    } catch (e) {
      this.logger.error(e.message, this.uploadAvatar.name);
      return sendError(e);
    }
  }
}
