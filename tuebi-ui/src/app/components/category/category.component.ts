import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { FormEditCategoryComponent } from 'src/app/components/form-edit-category/form-edit-category.component';
import { FIXED_CATEGORIES } from 'src/app/contansts/categories';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { UserSettings } from 'src/app/interfaces/user.interface';
import { Category } from 'src/app/modules/categories/categories.model';
import { BookmarksEntityService } from 'src/app/modules/categories/services/bookmarks-entity.service';
import { CategoriesEntityService } from 'src/app/modules/categories/services/categories-entity.service';
import { UserEntityService } from 'src/app/modules/categories/services/user-entity.service';
import { NzZorroModule } from 'src/app/nz-zorro.module';

@Component({
	selector: 'app-category',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, NzZorroModule, FormEditCategoryComponent, NgIconComponent],
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
	@Input() category: Category = {
		id: '',
		category_name: '',
		category_order: 0,
		category_theme: '',
		category_last_modified_time: '',
		category_created_time: '',
		user_id: ''
	};
	@Input() bookmarks$: Observable<Bookmark[]> = of([]);
	@Input() isAll = false;
	@Input() isUncategorized = false;
	@Input() isTrash = false;
	@Input() isCategorized = false;
	
	FIXED_CATEGORIES = FIXED_CATEGORIES;
	
	userSettings$: Observable<UserSettings | undefined> = of({
		is_favicon_shown: true,
		is_bookmark_url_shorten: false,
		is_bookmark_count_shown: true
	});
	
	count$: Observable<number> = of(0);
	name: string = '';
	
	constructor(
		private categoriesEntityService: CategoriesEntityService,
		private bookmarksEntityService: BookmarksEntityService,
		private userEntityService: UserEntityService
	) {
		this.userSettings$ = this.userEntityService.entities$.pipe(
			map((users) => users[0]),
			map((user) => {
				if (user) {
					return user.user_settings;
				}
				return undefined;
			})
		);
	}
	
	ngOnInit(): void {
		if (this.isAll) {
			this.name = FIXED_CATEGORIES.data.all;
			this.count$ = this.bookmarks$.pipe(
				map((bookmarks) => bookmarks.filter(bookmark => !bookmark.bookmark_deleted)),
				map((bookmarks) => bookmarks.length)
			);
		} else if (this.isUncategorized) {
			this.name = FIXED_CATEGORIES.data.uncategorized;
			this.count$ = this.bookmarks$.pipe(
				map((bookmarks) => bookmarks.filter(bookmark => !bookmark.category_id && !bookmark.bookmark_deleted)),
				map((bookmarks) => bookmarks.length)
			);
		} else if (this.isTrash) {
			this.name = FIXED_CATEGORIES.data.trash;
			this.count$ = this.bookmarks$.pipe(
				map((bookmarks) => bookmarks.filter(bookmark => bookmark.bookmark_deleted)),
				map((bookmarks) => bookmarks.length)
			);
		} else if(this.isCategorized) {
			this.name = this.category.category_name;
			this.count$ = this.bookmarks$.pipe(
				map((bookmarks) => bookmarks.filter(bookmark => bookmark.category_id === this.category.id && !bookmark.bookmark_deleted)),
				map((bookmarks) => bookmarks.length)
			);
		}
	}
	
	async deleteOneCategory(id: string) {
		// Move Bookmarks belong to that category to trash
		const bookmarksToDelete$ = this.bookmarks$.pipe(
			map((bookmarks) => {
				return bookmarks.filter((bookmark) => bookmark.category_id === id);
			})
		);
		
		const bookmarksToDelete = await firstValueFrom(bookmarksToDelete$);
		
		if (bookmarksToDelete.length) {
			for (const bookmark of bookmarksToDelete) {
				this.bookmarksEntityService.update({
					id: bookmark.id,
					bookmark_deleted: true,
					category_id: ''
				});
			}
		}
		
		// Delete Category
		this.categoriesEntityService.delete(id);
	}
	
}
