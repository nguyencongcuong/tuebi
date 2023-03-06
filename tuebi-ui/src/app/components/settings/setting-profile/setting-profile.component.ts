import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { map, Observable} from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { UserEntityService } from '../../../services/user-entity.service';
import { UserService } from '../../../services/user.service';
import { ChangelogComponent } from '../../changelog/changelog.component';

@Component({
	selector: 'app-setting-profile',
	standalone: true,
	imports: [CommonModule, NzSpinModule, NzDividerModule, ChangelogComponent],
	templateUrl: './setting-profile.component.html',
	styleUrls: ['./setting-profile.component.scss']
})
export class SettingProfileComponent {
	user$ = new Observable<User>();
	
	constructor(
		private userService: UserService,
		private userEntityService: UserEntityService,
	) {
		this.user$ = this.userEntityService.entities$.pipe(
			map(users => users[0])
		);
	}
	
}
