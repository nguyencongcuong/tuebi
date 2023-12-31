import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { firstValueFrom, map, Observable, of, take } from 'rxjs';
import { FIXED_CATEGORIES } from '../../../enums/categories.enum';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Category } from '../../../interfaces/category.interface';
import { UserSettings } from '../../../interfaces/user.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { CategoriesEntityService } from '../../../modules/categories/categories.entity.service';
import { UserEntityService } from '../../../services/user-entity.service';
import { IconComponent } from '../../commons/icon/icon.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';

@Component({
	selector: 'app-category',
	standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    IconComponent,
    EditCategoryComponent,
    MatMenuModule
  ],
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
	
	userSettings$: Observable<UserSettings | undefined> = of({
		is_compact_mode_on: false,
		is_favicon_shown: true,
		is_bookmark_url_shorten: false,
		is_bookmark_count_shown: true,
		is_bookmark_url_shown: true,
		user_month_to_delete: 3,
	});
	
	count$: Observable<number> = of(0);
	name: string = '';
	categoryRouterLink: any = [];
	
	constructor(
		private categoryEntityService: CategoriesEntityService,
		private bookmarkEntityService: BookmarkEntityService,
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
			this.categoryRouterLink = ['/space/categories/all'];
			this.count$ = this.bookmarks$.pipe(
				map((bookmarks) => bookmarks.filter(bookmark => !bookmark.bookmark_deleted)),
				map((bookmarks) => bookmarks.length)
			);
		} else if (this.isUncategorized) {
			this.name = FIXED_CATEGORIES.data.uncategorized;
			this.categoryRouterLink = ['/space/categories/uncategorized'];
			this.count$ = this.bookmarks$.pipe(
				map((bookmarks) => bookmarks.filter(bookmark => !bookmark.category_id && !bookmark.bookmark_deleted)),
				map((bookmarks) => bookmarks.length)
			);
		} else if (this.isTrash) {
			this.name = FIXED_CATEGORIES.data.trash;
			this.categoryRouterLink = ['/space/categories/trash'];
			this.count$ = this.bookmarks$.pipe(
				map((bookmarks) => bookmarks.filter(bookmark => bookmark.bookmark_deleted)),
				map((bookmarks) => bookmarks.length)
			);
		} else if(this.isCategorized) {
			this.name = this.category.category_name;
			this.categoryRouterLink = [`/space/categories/${this.category.id}`];
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
				this.bookmarkEntityService.update({
					id: bookmark.id,
					bookmark_deleted: true,
					category_id: ''
				});
			}
		}
		
		// Delete Category
		this.categoryEntityService.delete(id);
	}
	
	open(bookmarkURL: string) {
		const url = bookmarkURL.includes('https://')
			? bookmarkURL
			: `https://${bookmarkURL}`
		window.open(url);
	}
	
	openAllInNewTab() {
		this.bookmarks$.pipe(
			take(1),
			map((bookmarks) => bookmarks.filter(bookmark => bookmark.category_id === this.category.id && !bookmark.bookmark_deleted)),
			map((bookmarks) => bookmarks.forEach(bookmark => this.open(bookmark.bookmark_url)))
		).subscribe();
	}
	
}
