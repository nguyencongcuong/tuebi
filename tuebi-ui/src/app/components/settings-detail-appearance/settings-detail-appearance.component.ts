import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { UserEntityService } from 'src/app/modules/categories/services/user-entity.service';
import { UserService } from 'src/app/modules/categories/services/user.service';

@Component({
	selector: 'app-settings-detail-appearance',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, NzInputModule, NzSwitchModule, NzDividerModule, NzIconModule],
	templateUrl: './settings-detail-appearance.component.html',
	styleUrls: ['./settings-detail-appearance.component.scss']
})
export class SettingsDetailAppearanceComponent {
	user$ = new Observable<User>();
	
	// Default value, check API
	isCompactModeOn = false;
	isFaviconShown = true;
	isBookmarkURLShorten = false;
	isBookmarkCountShown = true;
	
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
	
}
