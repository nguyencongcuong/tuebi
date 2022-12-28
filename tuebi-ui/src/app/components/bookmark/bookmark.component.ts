import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { map, Observable } from 'rxjs';
import { themes } from '../../enums/theme.enum';
import { Bookmark } from '../../interfaces/bookmark.interface';
import { UserSettings } from '../../interfaces/user.interface';
import { Category } from '../../interfaces/category.interface';
import { BookmarkEntityService } from '../../services/bookmark-entity.service';
import { BookmarkService } from '../../services/bookmark.service';
import { CategoryEntityService } from '../../services/category-entity.service';
import { UserEntityService } from '../../services/user-entity.service';
import { FormEditBookmarkComponent } from '../form-edit-bookmark/form-edit-bookmark.component';
import { IconComponent } from '../icon/icon.component';

@Component({
	standalone: true,
	selector: 'app-bookmark',
	imports: [
		CommonModule,
		FormEditBookmarkComponent,
		ClipboardModule,
		NzToolTipModule,
		NzTagModule,
		NzDropDownModule,
		NzDividerModule,
		MatIconModule,
		IconComponent
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
		category_id: ''
	};
	@Input() isCategorized: boolean = true;
	
	theme = themes[0];
	
	userSettings$ = new Observable<UserSettings>();
	categories$;
	categoryName$ = new Observable<string>();
	category$ = new Observable<Category | undefined>();
	
	quickActionItems = [
		{
			icon: 'content_copy',
			handleClick: () => {
				this.copy()
			}
		},
		{
			icon: 'link',
			handleClick: () => {
				this.open()
			}
		}
	]
	
	constructor(
		private userEntityService: UserEntityService,
		private bookmarkService: BookmarkService,
		private bookmarkEntityService: BookmarkEntityService,
		private categoryEntityService: CategoryEntityService,
		private clipboard: Clipboard,
		private notificationService: NzNotificationService
	) {
		this.categories$ = this.categoryEntityService.entities$;
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
			`${this.bookmark.bookmark_url} is copied to clipboard.`,
			{nzPlacement: 'bottomRight'}
		);
	}
	
	getFavicon(domain: string) {
		return this.bookmarkService.getFavicon(domain);
	}
	
	handleUrl(url: string, isShorten: boolean) {
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
}
