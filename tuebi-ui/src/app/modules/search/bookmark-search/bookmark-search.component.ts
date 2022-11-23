import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { BookmarksService } from '../../categories/services/bookmarks.service';
import { SearchService } from '../search.service';

@Component({
	selector: 'app-bookmark-search',
	templateUrl: './bookmark-search.component.html',
	styleUrls: ['./bookmark-search.component.scss']
})
export class BookmarkSearchComponent implements OnInit {
	public bookmarkList = new BehaviorSubject<Bookmark[]>([]);
	public searchedBookmarkList: Observable<Bookmark[]> = of([]);
	public keyword = '';
	public isSearching: boolean = false;
	
	constructor(
		private bookmarkService: BookmarksService,
		private searchService: SearchService
	) {
	
	}
	
	ngOnInit(): void {
		this.bookmarkService.readAll().pipe(map(res => res.data)).subscribe((data) => {
			this.searchedBookmarkList = data;
			this.bookmarkList.next(data);
		});
	}
	
	search() {
		this.isSearching = !!this.keyword;
		if (this.isSearching) {
			this.searchedBookmarkList = this.searchService.searchBookmarks(this.bookmarkList, this.keyword);
		}
	}
	
}
