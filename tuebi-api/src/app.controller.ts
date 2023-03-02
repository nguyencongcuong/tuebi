import { Controller, Get } from '@nestjs/common';
import { sendSuccess } from './utilities';

@Controller('')
export class AppController {
  @Get()
  welcome() {
    return sendSuccess('Welcome to tuebi.io API')
  }
}
