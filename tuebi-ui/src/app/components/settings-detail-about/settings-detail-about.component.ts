import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { UserEntityService } from 'src/app/services/user-entity.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-settings-detail-about',
	standalone: true,
	imports: [CommonModule, NzSpinModule, NzDividerModule],
	templateUrl: './settings-detail-about.component.html',
	styleUrls: ['./settings-detail-about.component.scss']
})
export class SettingsDetailAboutComponent implements OnInit {
	user$ = new Observable<User>();
	
	constructor(
		private userService: UserService,
		private userEntityService: UserEntityService,
	) {
		this.user$ = this.userEntityService.entities$.pipe(
			map(users => users[0])
		);
	}
	
	ngOnInit(): void {
	}
	
}
