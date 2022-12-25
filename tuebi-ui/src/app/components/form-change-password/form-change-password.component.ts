import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { map, tap } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	standalone: true,
	imports: [
		CommonModule, 
		RouterModule, 
		FormsModule, 
		ReactiveFormsModule, 
		NzFormModule, 
		NzIconModule, 
		NzInputModule, 
		NzAlertModule,
	],
	selector: 'app-form-change-password',
	templateUrl: './form-change-password.component.html',
	styleUrls: ['./form-change-password.component.scss']
})
export class FormChangePasswordComponent implements OnInit {
	form: FormGroup;
	errorMessage = '';
	hasError = false;
	
	constructor(
		private userService: UserService,
		private authService: AuthService,
		private fb: FormBuilder,
		private notificationService: NzNotificationService
	) {
		
		const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
		
		this.form = this.fb.group({
			id: ['', Validators.required],
			user_password: ['', [Validators.required]],
			user_confirmed_password: ['', Validators.required],
			// Minimum eight characters, at least one letter, one number and one special character:
			user_updated_password: ['', [Validators.required, Validators.pattern(regex)]]
		});
		
	}
	
	async ngOnInit() {
		const user = this.userService.getAuthedUser();
		this.form.patchValue({
			id: user.id
		});
		
		this.form.valueChanges.subscribe(() => {
			this.hasError = false;
			this.errorMessage = '';
		});
	}
	
	async changePassword() {
		const form = this.form.value;
		const {id, user_password, user_confirmed_password, user_updated_password} = form;
		
		if (!user_password || !user_confirmed_password || !user_updated_password) {
			this.errorMessage = 'You must fill all 3 password fields above.';
			this.hasError = true;
			return;
		}
		
		if (user_updated_password !== user_confirmed_password) {
			this.errorMessage = 'Your confirmed password is not matched.';
			this.hasError = true;
			return;
		}
		
		if (!this.form.controls['user_updated_password'].valid) {
			this.errorMessage = 'Your password must have minimum eight characters, at least one letter, one number and one special character.';
			this.hasError = true;
			return;
		}
		
		this.userService.updateOne({
			id: id,
			user_password: user_password,
			user_updated_password: user_updated_password
		})
			.pipe(
				map((res) => res),
				tap({
					next: (res) => {
						if (res.success) {
							this.notificationService.success(
								'Password Updated',
								'Your new password has been saved.',
								{
									nzPlacement: 'bottomRight'
								});
							this.hasError = false;
						} else {
							this.errorMessage = res.error;
							this.hasError = true;
						}
					},
					error: err => {
						this.notificationService.error(
							'Password Updated Failed',
							err.message,
							{
								nzPlacement: 'bottomRight'
							}
						);
					}
				})
			)
			.subscribe();
	}
	
}
