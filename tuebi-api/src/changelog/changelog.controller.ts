import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { sendError, sendSuccess } from '../utilities';
import { ChangelogService } from './changelog.service';
import { CreateChangelogDto } from './dto/create-changelog.dto';

@Controller('changelog')
export class ChangelogController {
  constructor(
    private readonly changelogService: ChangelogService,
  ) {}
  
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createChangelogDto: CreateChangelogDto) {
    try {
      await this.changelogService.create(createChangelogDto);
      return sendSuccess(createChangelogDto);
    } catch (e) {
      sendError(e);
    }
  }

  @Get()
  async read() {
    try {
      const changelog = await this.changelogService.read();
      return sendSuccess(changelog);
    } catch (e) {
      return sendError(e);
    }
  }
  
  @Roles(Role.Admin)
  @Delete()
  async delete() {
    try {
      await this.changelogService.delete();
      return sendSuccess();
    } catch (e) {
      return sendError(e);
    }
  }
}
