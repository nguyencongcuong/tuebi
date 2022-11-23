import { Component, Input } from '@angular/core';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';

@Component({
	selector: 'app-bookmark-search-item',
	templateUrl: './bookmark-search-item.component.html',
	styleUrls: ['./bookmark-search-item.component.scss']
})
export class BookmarkSearchItemComponent {
	@Input() bookmark: Bookmark = {
		id: '',
		user_id: '',
		category_id: '',
		bookmark_tags: [],
		bookmark_name: '',
		bookmark_url: '',
		bookmark_description: '',
		bookmark_favicon: '',
		bookmark_deleted: false,
		bookmark_created_time: '',
		bookmark_last_modified_time: '',
		bookmark_order: 0
	};
	
	getFavicon(domain: string) {
		return `http://www.google.com/s2/favicons?domain=${domain}`;
	}
	
}
