import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Category } from 'src/app/interfaces/category.interface';
import { ENTITY } from 'src/app/modules/categories/categories.module';

@Injectable()
export class CategoryEntityService extends EntityCollectionServiceBase<Category> {
	constructor(
		serviceElementFactory: EntityCollectionServiceElementsFactory
	) {
		super(ENTITY.CATEGORIES, serviceElementFactory);
	}
}