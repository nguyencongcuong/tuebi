import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { ENTITY } from 'src/app/modules/categories/categories.module';
import { Tag } from '../interfaces/tag.interface';

@Injectable()
export class TagEntityService extends EntityCollectionServiceBase<Tag> {
	
	constructor(serviceElementFactory: EntityCollectionServiceElementsFactory) {
		super(ENTITY.TAGS, serviceElementFactory);
	}
}