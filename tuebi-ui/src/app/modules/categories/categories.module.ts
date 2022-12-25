import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap, } from '@ngrx/data';
import { BookmarkComponent } from '../../components/bookmark/bookmark.component';
import { CategoryComponent } from '../../components/category/category.component';
import { FormAddBookmark } from '../../components/form-add-bookmark/form-add-bookmark';
import { FormAddCategory } from '../../components/form-add-category/form-add-category';
import { NzZorroModule } from '../../nz-zorro.module';
import { BookmarkDataService } from '../../services/bookmark-data.service';
import { BookmarkEntityService } from '../../services/bookmark-entity.service';
import { CategoryDataService } from '../../services/category-data.service';
import { CategoryEntityService } from '../../services/category-entity.service';
import { CategoryResolver } from '../../services/category.resolver';
import { UserDataService } from '../../services/user-data.service';
import { UserEntityService } from '../../services/user-entity.service';
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
		CategoryResolver,
		UserEntityService,
		CategoryEntityService,
		BookmarkEntityService,
		CategoryDataService,
		BookmarkDataService,
		UserDataService,
	],
})
export class CategoriesModule {
	constructor(
		private eds: EntityDefinitionService,
		private entityDataService: EntityDataService,
		private userDataService: UserDataService,
		private categoriesDataService: CategoryDataService,
		private bookmarksDataService: BookmarkDataService
	) {
		eds.registerMetadataMap(entityMetadata);
		entityDataService.registerService(ENTITY.USER, userDataService);
		entityDataService.registerService(ENTITY.CATEGORIES, categoriesDataService);
		entityDataService.registerService(ENTITY.BOOKMARKS, bookmarksDataService);
	}
}
