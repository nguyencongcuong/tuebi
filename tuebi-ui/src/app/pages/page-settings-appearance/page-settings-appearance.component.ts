import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { IconComponent } from '../../components/icon/icon.component';
import { User } from '../../interfaces/user.interface';
import { UserEntityService } from '../../services/user-entity.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-settings-detail-appearance',
	standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzInputModule, NzSwitchModule, NzDividerModule, NzIconModule, IconComponent],
	templateUrl: './page-settings-appearance.component.html',
	styleUrls: ['./page-settings-appearance.component.scss']
})
export class PageSettingsAppearanceComponent {
	user$ = new Observable<User>();
	
	// Default value, check API
	isCompactModeOn = false;
	isFaviconShown = true;
	isBookmarkURLShorten = false;
	isBookmarkCountShown = true;
	isBookmarkUrlShown = true;
	
	items = [
		{
			title: 'Compact Mode',
			isActive: this.isCompactModeOn,
			onToggle: () => this.toggleCompactMode(),
			desc: 'Can\'t see enough bookmarks? Let\'s use compact mode'
		},
		{
			title: 'Show Favicon',
			isActive: this.isFaviconShown,
			onToggle: () => this.toggleFaviconShown(),
			desc: 'Display an icon to the left of your bookmark URL'
		},
		{
			title: 'Show Bookmark URL',
			isActive: this.isBookmarkUrlShown,
			onToggle: () => this.toggleBookmarkUrl(),
			desc: 'Display the bookmark URL'
		},
		{
			title: 'Shorten Bookmark URL',
			isActive: this.isBookmarkURLShorten,
			onToggle: () => this.toggleBookmarkURLShorten(),
			desc: 'Hide \'http\', \'https\' at the beginning and \'/\' at the ending of your bookmark URL'
		},
		{
			title: 'Show Bookmark Count',
			isActive: this.isBookmarkCountShown,
			onToggle: () => this.toggleBookmarkCount(),
			desc: 'Display the total number of bookmarks for each category'
		}
	]
	
	constructor(
		private userService: UserService,
		private userEntityService: UserEntityService,
	) {
		this.user$ = this.userEntityService.entities$.pipe(
			map(users => users[0]),
			tap((user) => {
				if (user) {
					this.isCompactModeOn = user.user_settings.is_compact_mode_on;
					this.isFaviconShown = user.user_settings.is_favicon_shown;
					this.isBookmarkURLShorten = user.user_settings.is_bookmark_url_shorten;
					this.isBookmarkCountShown = user.user_settings.is_bookmark_count_shown;
					this.isBookmarkUrlShown = user.user_settings.is_bookmark_url_shown;
				}
			})
		);
	}
	
	async toggleCompactMode() {
		const user = await firstValueFrom(this.user$);
		this.userEntityService.update({
			id: user.id,
			user_settings: {
				...user.user_settings,
				is_compact_mode_on: !user.user_settings.is_compact_mode_on
			}
		});
	}
	
	async toggleFaviconShown() {
		const user = await firstValueFrom(this.user$);
		this.userEntityService.update({
			id: user.id,
			user_settings: {
				...user.user_settings,
				is_favicon_shown: !user.user_settings.is_favicon_shown
			}
		});
	}
	
	async toggleBookmarkURLShorten() {
		const user = await firstValueFrom(this.user$);
		this.userEntityService.update({
			id: user.id,
			user_settings: {
				...user.user_settings,
				is_bookmark_url_shorten: !user.user_settings.is_bookmark_url_shorten
			}
		});
	}
	
	async toggleBookmarkCount() {
		const user = await firstValueFrom(this.user$);
		this.userEntityService.update({
			id: user.id,
			user_settings: {
				...user.user_settings,
				is_bookmark_count_shown: !user.user_settings.is_bookmark_count_shown
			}
		});
	}
	
	async toggleBookmarkUrl() {
		const user = await firstValueFrom(this.user$);
		this.userEntityService.update({
			id: user.id,
			user_settings: {
				...user.user_settings,
				is_bookmark_url_shown: !user.user_settings.is_bookmark_url_shown
			}
		});
	}
	
}
