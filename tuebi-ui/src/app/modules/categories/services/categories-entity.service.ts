import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Category } from '../categories.model';
import { ENTITY } from '../categories.module';

@Injectable()
export class CategoriesEntityService extends EntityCollectionServiceBase<Category> {
	constructor(
		serviceElementFactory: EntityCollectionServiceElementsFactory
	) {
		super(ENTITY.CATEGORIES, serviceElementFactory);
	}
}