import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import * as _ from 'lodash';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { map, Observable, of } from 'rxjs';
import { COLOR_MAPPING } from '../../../enums/color-mapping.enum';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Category } from '../../../interfaces/category.interface';
import { Tag } from '../../../interfaces/tag.interface';
import { UserSettings } from '../../../interfaces/user.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { BookmarkService } from '../../../services/bookmark.service';
import { CategoriesEntityService } from '../../../modules/categories/categories.entity.service';
import { TagEntityService } from '../../../services/tag-entity.service';
import { UserEntityService } from '../../../services/user-entity.service';
import { IconComponent } from '../../commons/icon/icon.component';
import { EditBookmarkComponent } from '../edit-bookmark/edit-bookmark.component';

@Component({
	standalone: true,
	selector: 'app-bookmark',
	imports: [
		CommonModule,
		EditBookmarkComponent,
		ClipboardModule,
		NzTagModule,
		NzDividerModule,
		MatIconModule,
		IconComponent,
		NzDropDownModule
	],
	templateUrl: './bookmark.component.html',
	styleUrls: ['./bookmark.component.scss'],
})
export class BookmarkComponent implements OnInit {
	@Input() bookmark: Bookmark = {
		id: '',
		bookmark_deleted: false,
		bookmark_url: '',
		bookmark_name: '',
		bookmark_description: '',
		bookmark_favicon: '',
		bookmark_order: 0,
		bookmark_tags: [],
		bookmark_created_time: '',
		bookmark_last_modified_time: '',
		user_id: '',
		category_id: '',
		is_selected: false
	};
	@Input() isCategorized: boolean = true;
	@Input() isSearching: boolean = false;
	
	colorMapping = COLOR_MAPPING;
	
	userSettings$ = new Observable<UserSettings>();
	categories$;
	categoryName$ = new Observable<string>();
	category$ = new Observable<Category | undefined>();
	tags$ = new Observable<Tag[]>();
	
	constructor(
		private userEntityService: UserEntityService,
		private bookmarkService: BookmarkService,
		private bookmarkEntityService: BookmarkEntityService,
		private categoryEntityService: CategoriesEntityService,
		private tagEntityService: TagEntityService,
		private clipboard: Clipboard,
		private notificationService: NzNotificationService,
	) {
		this.categories$ = this.categoryEntityService.entities$;
		this.tags$ = this.tagEntityService.entities$;
		this.userSettings$ = userEntityService.entities$.pipe(
			map((users) => users[0].user_settings)
		);
	}
	
	async ngOnInit() {
		this.categoryName$ = this.categories$.pipe(
			map((categories) =>
				categories.find((item) => item.id === this.bookmark.category_id)
			),
			map((category) => (category ? category.category_name : 'Uncategorized'))
		);
		
		this.category$ = this.categories$.pipe(
			map((categories) =>
				categories.find((category) => category.id === this.bookmark.category_id)
			)
		);
	}
	
	remove() {
		this.bookmarkEntityService.update({
			id: this.bookmark.id,
			bookmark_deleted: true,
		});
	}
	
	delete() {
		this.bookmarkEntityService.delete(this.bookmark.id);
	}
	
	restore() {
		this.bookmarkEntityService.update({
			id: this.bookmark.id,
			bookmark_deleted: false,
		});
	}
	
	open() {
		const url = this.bookmark.bookmark_url.includes('https://') 
			? this.bookmark.bookmark_url
			: `https://${this.bookmark.bookmark_url}`
		window.open(url);
	}
	
	copy() {
		this.clipboard.copy(this.bookmark.bookmark_url);
		this.notificationService.success(
			'Copied',
			'',
			{nzPlacement: 'bottomRight'}
		);
	}
	
	getFavicon(domain: string) {
		return this.bookmarkService.getFavicon(domain);
	}
	
	normalizeBookmarkURL(url: string) {
		if(!url.includes('http') || !url.includes('https')) {
			return 'https://' + url;
		} else {
			return url;
		}
	}
	
	shortenBookmarkURL(url: string, isShorten: boolean) {
		let result = url;
		
		const urlShortenRegex = new RegExp(
			/(http:\/\/)|(https:\/\/)|(www.)|(\/*$)/gm
		);
		
		const regex = new RegExp(/(\/)(.+)/gm);
		
		if (isShorten) {
			result = url.replace(urlShortenRegex, '').replace(regex, '');
			return result.slice(0,32);
		}
		
		return result.slice(0,32) + '...';
	}
	
	getTags(): Observable<Tag[]> {
		if(this.bookmark.bookmark_tags && this.bookmark.bookmark_tags.length) {
			return this.tags$.pipe(map(tags => tags.filter(tag => this.bookmark.bookmark_tags.includes(tag.id))))
		} else {
			return of([])
		}
	}
	
	mapColor(color: string) {
		if(_.has(this.colorMapping, color)) {
			return this.colorMapping[color].tc
		} else {
			return '#000000'
		}
	}
}
