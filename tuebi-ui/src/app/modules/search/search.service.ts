import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { map, Observable } from 'rxjs';
import { Bookmark } from '../../interfaces/bookmark.interface';

@Injectable({
	providedIn: 'root'
})
export class SearchService {
	
	searchBookmarks(bookmarks: Observable<Bookmark[]>, keyword: string): Observable<any> {
		const options = {
			includeScore: true,
			keys: ['bookmark_name']
		};
		
		return bookmarks.pipe(map(data => {
			const fuse = new Fuse(data, options);
			const searchResult = fuse.search(keyword);
			return searchResult.map((item) => item.item);
		}));
	}
	
}
