import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, firstValueFrom, map, Observable, of } from 'rxjs';
import { themes } from '../../enums/theme.enum';
import { Bookmark } from '../../interfaces/bookmark.interface';
import { BookmarkEntityService } from '../../services/bookmark-entity.service';
import { CategoryEntityService } from '../../services/category-entity.service';
import { BookmarkComponent } from '../../components/bookmark/bookmark.component';
import { FormAddBookmark } from '../../components/form-add-bookmark/form-add-bookmark';

@Component({
  standalone: true,
  imports: [CommonModule, BookmarkComponent, FormAddBookmark, DragDropModule],
	selector: 'app-category-detail',
	templateUrl: './page-bookmarks.component.html',
	styleUrls: ['./page-bookmarks.component.scss']
})
export class PageBookmarksComponent implements OnInit {
	id: string = '';
	bookmarks$: Observable<Bookmark[]> = of([]);
	currentRoute$: Observable<string> = of('');
	filteredBookmarks$: Observable<Bookmark[]> = of([]);
	isEmpty$: Observable<boolean> = of(false);
	
	theme = themes[0]
	
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private categoryEntityService: CategoryEntityService,
		private bookmarkEntityService: BookmarkEntityService
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
