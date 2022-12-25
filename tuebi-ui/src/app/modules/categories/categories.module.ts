import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap, } from '@ngrx/data';
import { BookmarkComponent } from 'src/app/components/bookmark/bookmark.component';
import { CategoryComponent } from 'src/app/components/category/category.component';
import { FormAddBookmark } from 'src/app/components/form-add-bookmark/form-add-bookmark';
import { FormAddCategory } from 'src/app/components/form-add-category/form-add-category';
import { BookmarksDataService } from 'src/app/services/bookmarks-data.service';
import { BookmarksEntityService } from 'src/app/services/bookmarks-entity.service';
import { CategoriesDataService } from 'src/app/services/categories-data.service';
import { CategoriesEntityService } from 'src/app/services/categories-entity.service';
import { CategoriesResolver } from 'src/app/services/categories.resolver';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserEntityService } from 'src/app/services/user-entity.service';
import { NzZorroModule } from '../../nz-zorro.module';
import { CategoriesRoutingModule } from './categories-routing.module';

export const ENTITY = {
	CATEGORIES: 'Categories',
	BOOKMARKS: 'Bookmarks',
	USER: 'User',
};

export const entityMetadata: EntityMetadataMap = {
	[ENTITY.USER]: {
		selectId: (model) => model.id,
		entityDispatcherOptions: {
			optimisticUpdate: true,
			optimisticDelete: true,
		},
	},
	
	[ENTITY.CATEGORIES]: {
		selectId: (model) => model.id,
		sortComparer: (a, b) => {
			if (a.category_order > b.category_order) {
				return 1;
			} else if (a.category_order < b.category_order) {
				return -1;
			} else {
				if (a._ts > b._ts) {
					return -1;
				} else if (a._ts < b._ts) {
					return 1;
				} else {
					return 0;
				}
			}
		},
		entityDispatcherOptions: {
			optimisticUpdate: true,
			optimisticDelete: true,
		},
	},
	
	[ENTITY.BOOKMARKS]: {
		selectId: (model) => model.id,
		sortComparer: (a, b) => {
			if (a.bookmark_order > b.bookmark_order) {
				return 1;
			} else if (a.bookmark_order < b.bookmark_order) {
				return -1;
			} else {
				if (a._ts > b._ts) {
					return -1;
				} else if (a._ts < b._ts) {
					return 1;
				} else {
					return 0;
				}
			}
		},
		entityDispatcherOptions: {
			optimisticUpdate: true,
			optimisticDelete: true,
		},
	},
};

@NgModule({
	declarations: [
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		CategoriesRoutingModule,
		NzZorroModule,
		CategoryComponent,
		BookmarkComponent,
		FormAddCategory,
		FormAddBookmark
	],
	providers: [
		CategoriesResolver,
		UserEntityService,
		CategoriesEntityService,
		BookmarksEntityService,
		CategoriesDataService,
		BookmarksDataService,
		UserDataService,
	],
})
export class CategoriesModule {
	constructor(
		private eds: EntityDefinitionService,
		private entityDataService: EntityDataService,
		private userDataService: UserDataService,
		private categoriesDataService: CategoriesDataService,
		private bookmarksDataService: BookmarksDataService
	) {
		eds.registerMetadataMap(entityMetadata);
		entityDataService.registerService(ENTITY.USER, userDataService);
		entityDataService.registerService(ENTITY.CATEGORIES, categoriesDataService);
		entityDataService.registerService(ENTITY.BOOKMARKS, bookmarksDataService);
	}
}
