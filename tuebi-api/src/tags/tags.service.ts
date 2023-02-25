import { PatchOperation, SqlQuerySpec } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { AzDbService } from '../azure/az-db.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  private logger = new Logger(TagsService.name);
  private db = new AzDbService('tags');
  
  async createOne(createTagDto: CreateTagDto) {
    try {
      return await this.db.createOne<CreateTagDto>(createTagDto);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async readMany(query: SqlQuerySpec) {
    try {
      return await this.db.readMany<Tag[]>(query);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async readOne(id: string, partitionKey: string) {
    try {
      return await this.db.readOne<Tag>(id, partitionKey);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async updateOne(id: string, partitionKey: string, operations: PatchOperation[]) {
    try {
      return await this.db.updateOne<Tag>(id, partitionKey, operations);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async deleteOne(id: string, partitionKey: string) {
    try {
      await this.db.deleteOne(id, partitionKey);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
