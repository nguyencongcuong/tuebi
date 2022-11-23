import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { CategoryType } from 'src/app/contansts/categories';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { Category } from 'src/app/modules/categories/categories.model';
import { BookmarksEntityService } from 'src/app/modules/categories/services/bookmarks-entity.service';
import { CategoriesEntityService } from 'src/app/modules/categories/services/categories-entity.service';

@Component({
	standalone: true,
	selector: 'app-bookmarks',
	imports: [CommonModule],
	templateUrl: './bookmarks.component.html',
	styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent {
	categories$: Observable<Category[]> = of([]);
	bookmarks$: Observable<Bookmark[]> = of([]);
	filteredBookmarks$: Observable<Bookmark[]> = of([]);
	
	isDrawerVisible = false;
	
	currentCategoryType: CategoryType = 'All';
	isCategorized: boolean = false;
	
	constructor(
		private categoryEntityService: CategoriesEntityService,
		private bookmarksEntityService: BookmarksEntityService
	) {
		this.bookmarks$ = this.bookmarksEntityService.entities$;
		this.filteredBookmarks$ = this.bookmarks$;
		this.categories$ = this.categoryEntityService.entities$;
	}
	
	async dropBookmark(event: CdkDragDrop<string[]>) {
		const newFilteredBookmarks$ = this.filteredBookmarks$.pipe(
			map((bookmarks) => {
				moveItemInArray(bookmarks, event.previousIndex, event.currentIndex);
				return bookmarks.map((bookmark, i) => ({id: bookmark.id, bookmark_order: i}));
			})
		);
		
		const newFilteredBookmarks = await firstValueFrom(newFilteredBookmarks$);
		
		for (const bookmark of newFilteredBookmarks) {
			this.bookmarksEntityService.update(bookmark);
		}
	}
	
	async dropCategory(event: CdkDragDrop<string[]>) {
		const newCategories$ = this.categories$.pipe(
			map((categories) => {
				moveItemInArray(categories, event.previousIndex, event.currentIndex);
				return categories.map((category, i) => ({id: category.id, category_order: i}));
			})
		);
		
		const newCategories = await firstValueFrom(newCategories$);
		
		for (const category of newCategories) {
			this.categoryEntityService.update(category);
		}
	}
	
	filterBookmarks(type: CategoryType, category?: Category) {
		switch (type) {
			case 'All':
				this.isCategorized = false;
				this.currentCategoryType = 'All';
				this.filteredBookmarks$ = this.bookmarks$.pipe(
					map((bookmarks) =>
						bookmarks.filter((bookmark) => !bookmark.bookmark_deleted)
					)
				);
				break;
			case 'Uncategorized':
				this.isCategorized = false;
				this.currentCategoryType = 'Uncategorized';
				this.filteredBookmarks$ = this.bookmarks$.pipe(
					map((bookmarks) =>
						bookmarks.filter(bookmark => !bookmark.bookmark_deleted && !bookmark.category_id))
				);
				break;
			case 'Categorized':
				this.isCategorized = true;
				this.currentCategoryType = 'Categorized';
				this.filteredBookmarks$ = this.bookmarks$.pipe(
					map((bookmarks) =>
						bookmarks.filter((bookmark) => !bookmark.bookmark_deleted && bookmark.category_id === category?.id)
					)
				);
				break;
			case 'Trash':
				this.isCategorized = false;
				this.currentCategoryType = 'Trash';
				this.filteredBookmarks$ = this.bookmarks$.pipe(
					map((bookmarks) => {
						return bookmarks.filter((bookmark) => bookmark.bookmark_deleted);
					})
				);
				break;
			default:
				break;
		}
		
	}
	
	// DRAWER
	openDrawer() {
		this.isDrawerVisible = true;
	}
	
	closeDrawer() {
		this.isDrawerVisible = false;
	}
}
