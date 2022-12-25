import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { debounceTime, firstValueFrom, map, Observable, tap } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { UserEntityService } from '../../services/user-entity.service';

@Component({
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzSpinModule, NzIconModule],
	selector: 'app-form-edit-profile',
	templateUrl: './form-edit-profile.component.html',
	styleUrls: ['./form-edit-profile.component.scss']
})
export class FormEditProfileComponent implements OnInit {
	form: FormGroup;
	user$ = new Observable<User>();
	user = {} as User;
	
	isLoading: boolean = false;
	isCompleted: boolean = false;
	
	constructor(
		private userEntityService: UserEntityService,
		private fb: FormBuilder
	) {
		this.user$ = this.userEntityService.entities$.pipe(map(users => users[0]));
		
		this.form = this.fb.group({
			id: ['', Validators.required],
			user_name: [''],
			user_email: ['']
		});
	}
	
	async ngOnInit() {
		this.user = await firstValueFrom(this.user$);
		
		this.form.patchValue({
			id: this.user.id,
			user_name: this.user.user_name || '',
			user_email: this.user.user_email
		});
		
		this.form.valueChanges
			.pipe(tap(() => {
				this.isCompleted = false;
				this.isLoading = true;
			}))
			.pipe(debounceTime(1500))
			.subscribe((form) => {
				this.userEntityService.update(form)
					.pipe(tap({
						next: () => {
							this.isLoading = false;
							this.isCompleted = true;
						}
					}))
					.subscribe();
			});
	}
}
