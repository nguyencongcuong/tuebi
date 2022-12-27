import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { firstValueFrom, map, Observable, of, tap } from 'rxjs';
import { IconComponent } from '../../components/icon/icon.component';
import { User } from '../../interfaces/user.interface';
import { UserEntityService } from '../../services/user-entity.service';
import { UserService } from '../../services/user.service';

interface SettingItem {
	title: string,
	isActive: boolean,
	onToggle: Function,
	desc: string
}

@Component({
	selector: 'app-settings-detail-appearance',
	standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzInputModule, NzSwitchModule, NzDividerModule, NzIconModule, IconComponent],
	templateUrl: './page-settings-appearance.component.html',
	styleUrls: ['./page-settings-appearance.component.scss']
})
export class PageSettingsAppearanceComponent implements OnInit {
	user$ = new Observable<User>();
	
	isCompactModeOn = false;
	isFaviconShown= false;
	isBookmarkUrlShown = false;
	isBookmarkUrlShorten = false;
	isBookmarkCountShown = false;
	
	constructor(
		private userService: UserService,
		private userEntityService: UserEntityService,
	) {
		this.user$ = this.userEntityService.entities$.pipe(map(users => users[0]));
	}
	
	public ngOnInit() {
		this.user$.subscribe(user => {
			const {
					is_compact_mode_on,
					is_favicon_shown,
					is_bookmark_url_shown,
					is_bookmark_url_shorten,
					is_bookmark_count_shown
			} = user.user_settings
			
			this.isCompactModeOn = is_compact_mode_on;
			this.isFaviconShown = is_favicon_shown;
			this.isBookmarkUrlShown = is_bookmark_url_shown;
			this.isBookmarkUrlShorten = is_bookmark_url_shorten;
			this.isBookmarkCountShown = is_bookmark_count_shown;
		});
	}
	
	async toggle(key: 
			'is_compact_mode_on' | 
			'is_favicon_shown' | 
			'is_bookmark_url_shorten' | 
			'is_bookmark_count_shown' | 
			'is_bookmark_url_shown'
	) {
		const user = await firstValueFrom(this.user$);
		
		this.userEntityService.update({
			id: user.id,
			user_settings: {
				...user.user_settings,
				[key]: !user.user_settings[key]
			}
		});
	}
	
	async toggleCompactMode() {
		await this.toggle('is_compact_mode_on');	
	}
	
	async toggleFaviconShown() {
		await this.toggle('is_favicon_shown');
	}
	
	async toggleBookmarkUrlShown() {
		await this.toggle('is_bookmark_url_shown');
	}
	
	async toggleBookmarkUrlShorten() {
		await this.toggle('is_bookmark_url_shorten');
	}
	
	async toggleBookmarkCountShown() {
		await this.toggle('is_bookmark_count_shown');
	}
	
}
