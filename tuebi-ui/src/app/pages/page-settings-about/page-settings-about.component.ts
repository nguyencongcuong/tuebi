import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { map, Observable} from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { UserEntityService } from '../../services/user-entity.service';
import { UserService } from '../../services/user.service';
import { ChangelogComponent } from '../../components/changelog/changelog.component';

@Component({
	selector: 'app-settings-detail-about',
	standalone: true,
	imports: [CommonModule, NzSpinModule, NzDividerModule, ChangelogComponent],
	templateUrl: './page-settings-about.component.html',
	styleUrls: ['./page-settings-about.component.scss']
})
export class PageSettingsAboutComponent {
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
