import { Controller, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureB2cJwt } from '../auth/guards/azure-b2c-jwt';
import { sendError, sendSuccess } from '../utilities';
import { ImagesService } from './images.service';
import { Logger } from '@nestjs/common';

@Controller('images')
export class ImagesController {
  private logger = new Logger(ImagesController.name);
  
  constructor(
    private readonly imagesService: ImagesService
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
      const data = {
        id: user.id,
        user_avatar_url: url,
      };
      return sendSuccess(data);
    } catch (e) {
      this.logger.error(e.message, this.uploadAvatar.name);
      return sendError(e);
    }
  }
}
