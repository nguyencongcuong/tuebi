import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { map, Observable, of, take } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Tag } from '../../../interfaces/tag.interface';
import { UserSettings } from '../../../interfaces/user.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { TagEntityService } from '../../../services/tag-entity.service';
import { UserEntityService } from '../../../services/user-entity.service';
import { IconComponent } from '../../icon/icon.component';
import { EditTagComponent } from '../edit-tag/edit-tag.component';

@Component({
	selector: 'app-tag',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		DragDropModule,
		NzDropDownModule,
		NzIconModule,
		IconComponent,
		EditTagComponent
	],
	templateUrl: './tag.component.html',
	styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
	@Input() tag: Tag = {} as Tag;
	
	userSettings$: Observable<UserSettings | undefined> = of({
		is_compact_mode_on: false,
		is_favicon_shown: true,
		is_bookmark_url_shorten: false,
		is_bookmark_count_shown: true,
		is_bookmark_url_shown: true,
		user_month_to_delete: 3,
	});
	
	bookmarks$: Observable<Bookmark[]> = of([])
	count$: Observable<number> = of(0);
	name: string = '';
	tagRouterLink: any = [];
	
	constructor(
		private tagEntityService: TagEntityService,
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
		this.bookmarks$ = this.bookmarkEntityService.entities$
	}
	
	ngOnInit(): void {
		this.name = this.tag.tag_name || '';
		this.tagRouterLink = [`/space/tags/${this.tag.id}`];
		this.count$ = this.bookmarks$.pipe(
			map((bookmarks) => bookmarks.filter(bookmark => bookmark.bookmark_tags.includes(this.tag.id || '') && !bookmark.bookmark_deleted)),
			map((bookmarks) => bookmarks.length)
		);
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
			map((bookmarks) => bookmarks.filter(bookmark => bookmark.bookmark_tags.includes(this.tag.id || '') && !bookmark.bookmark_deleted)),
			map((bookmarks) => bookmarks.forEach(bookmark => this.open(bookmark.bookmark_url)))
		).subscribe();
	}
	
	deleteTag() {
		if(this.tag.id) {
			this.tagEntityService.delete(this.tag.id)
		}
	}
	
}
