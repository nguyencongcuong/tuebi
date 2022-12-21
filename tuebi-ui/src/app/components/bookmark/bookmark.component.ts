import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { map, Observable } from 'rxjs';
import { FormEditBookmarkComponent } from 'src/app/components/form-edit-bookmark/form-edit-bookmark.component';
import { themes } from 'src/app/contansts/theme';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { UserSettings } from 'src/app/interfaces/user.interface';
import { Category } from 'src/app/modules/categories/categories.model';
import { BookmarksEntityService } from 'src/app/modules/categories/services/bookmarks-entity.service';
import { BookmarksService } from 'src/app/modules/categories/services/bookmarks.service';
import { CategoriesEntityService } from 'src/app/modules/categories/services/categories-entity.service';
import { UserEntityService } from 'src/app/modules/categories/services/user-entity.service';
import { NgIconModule } from 'src/app/ng-icon.module';
import { NzZorroModule } from 'src/app/nz-zorro.module';

@Component({
	standalone: true,
	selector: 'app-bookmark',
	imports: [
		CommonModule,
		FormEditBookmarkComponent,
		NzZorroModule,
		NgIconComponent,
		ClipboardModule,
		NgIconModule
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
			icon: 'oct-copy',
			handleClick: () => {
				this.copy()
			}
		},
		{
			icon: 'oct-link',
			handleClick: () => {
				this.open()
			}
		}
	]
	
	constructor(
		private userEntityService: UserEntityService,
		private bookmarksService: BookmarksService,
		private bookmarksEntityService: BookmarksEntityService,
		private categoryEntityService: CategoriesEntityService,
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
		this.bookmarksEntityService.update({
			id: this.bookmark.id,
			bookmark_deleted: true,
		});
	}
	
	delete() {
		this.bookmarksEntityService.delete(this.bookmark.id);
	}
	
	restore() {
		this.bookmarksEntityService.update({
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
		return this.bookmarksService.getFavicon(domain);
	}
	
	handleUrl(url: string, isShorten: boolean) {
		let result = url;
		const urlShortenRegex = new RegExp(
			/(http:\/\/)|(https:\/\/)|(www.)|(\/*$)/gm
		);
		const regex = new RegExp(/(\/)(.+)/gm);
		
		if (isShorten) {
			result = url.replace(urlShortenRegex, '').replace(regex, '');
		}
		
		return result;
	}
}
