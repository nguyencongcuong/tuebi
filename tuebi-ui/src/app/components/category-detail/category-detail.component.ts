import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, firstValueFrom, map, Observable, of } from 'rxjs';
import { BookmarkComponent } from 'src/app/components/bookmark/bookmark.component';
import { FormAddBookmark } from 'src/app/components/form-add-bookmark/form-add-bookmark';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { BookmarksEntityService } from 'src/app/modules/categories/services/bookmarks-entity.service';
import { CategoriesEntityService } from 'src/app/modules/categories/services/categories-entity.service';

@Component({
  standalone: true,
  imports: [CommonModule, BookmarkComponent, FormAddBookmark, DragDropModule],
	selector: 'app-category-detail',
	templateUrl: './category-detail.component.html',
	styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
	id: string = '';
	bookmarks$: Observable<Bookmark[]> = of([]);
	currentRoute$: Observable<string> = of('');
	filteredBookmarks$: Observable<Bookmark[]> = of([]);
	isEmpty$: Observable<boolean> = of(false);
	
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private categoryEntityService: CategoriesEntityService,
		private bookmarkEntityService: BookmarksEntityService
	) {
	}
	
	async ngOnInit() {
		this.currentRoute$ = this.route.paramMap.pipe(map((res: any) => res.params.id));
		this.bookmarks$ = this.bookmarkEntityService.entities$;
		
		this.filteredBookmarks$ = combineLatest([this.currentRoute$, this.bookmarks$]).pipe(
			map(([id, bookmarks]) => {
				if (id === 'trash') {
					return bookmarks.filter(bookmark => bookmark.bookmark_deleted);
				} else if (id === 'all') {
					return bookmarks.filter(bookmark => !bookmark.bookmark_deleted);
				} else if (id === 'uncategorized') {
					return bookmarks.filter(bookmark => !bookmark.category_id && !bookmark.bookmark_deleted);
				} else {
					return bookmarks.filter(bookmark => bookmark.category_id === id && !bookmark.bookmark_deleted);
				}
			})
		);
		
		this.isEmpty$ = this.filteredBookmarks$.pipe(map(bookmarks => !bookmarks.length));
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
			this.bookmarkEntityService.update(bookmark);
		}
	}
}
