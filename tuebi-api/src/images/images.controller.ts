import { Controller, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureB2cJwt } from '../auth/guards/azure-b2c-jwt';
import { sendError, sendSuccess } from '../utilities';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
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
      console.log(e)
      return sendError(e);
    }
  }
}
