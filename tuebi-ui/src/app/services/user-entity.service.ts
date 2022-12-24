import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { User } from 'src/app/interfaces/user.interface';
import { ENTITY } from 'src/app/modules/categories/categories.module';

@Injectable()
export class UserEntityService extends EntityCollectionServiceBase<User> {
	constructor(
		serviceElementFactory: EntityCollectionServiceElementsFactory
	) {
		super(ENTITY.USER, serviceElementFactory);
	}
}