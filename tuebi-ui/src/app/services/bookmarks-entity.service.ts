import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { ENTITY } from 'src/app/modules/categories/categories.module';

@Injectable()
export class BookmarksEntityService extends EntityCollectionServiceBase<Bookmark> {
	
	constructor(serviceElementFactory: EntityCollectionServiceElementsFactory) {
		super(ENTITY.BOOKMARKS, serviceElementFactory);
	}
}