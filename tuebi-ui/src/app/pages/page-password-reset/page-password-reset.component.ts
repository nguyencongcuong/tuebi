import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { tap } from 'rxjs';
import { ROUTE } from '../../enums/routes.enum';
import { themes } from '../../enums/theme.enum';
import { AuthService } from '../../modules/auth/auth.service';
import { NzZorroModule } from '../../nz-zorro.module';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-form-password-reset-request',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NzZorroModule,
		RouterModule,
	],
	providers: [UserService, NzNotificationService],
	templateUrl: './page-password-reset.component.html',
	styleUrls: ['./page-password-reset.component.scss'],
})
export class PagePasswordResetComponent implements OnInit {
	theme = themes[0];
	route = ROUTE;
	form: FormGroup;
	
	isLoading = false;
	isDisabled = true;
	
	constructor(
		private authService: AuthService,
		private userService: UserService,
		private fb: FormBuilder,
		private notification: NzNotificationService,
		private router: Router
	) {
		this.form = this.fb.group({
			user_email: ['', [Validators.required, Validators.email]],
			user_updated_password: ['', [Validators.required]],
			user_confirmed_password: ['', [Validators.required]],
			user_confirmation_code: ['', [Validators.required]],
		});
	}
	
	get userEmail() {
		return this.form.controls['user_email'];
	}
	
	get userUpdatedPassword() {
		return this.form.controls['user_updated_password'];
	}
	
	get userConfirmedPassword() {
		return this.form.controls['user_confirmed_password'];
	}
	
	get userConfirmationCode() {
		return this.form.controls['user_confirmation_code'];
	}
	
	ngOnInit(): void {
		this.form.valueChanges.subscribe(() => {
			this.isDisabled = !this.form.valid;
		});
	}
	
	load(isLoading: boolean) {
		this.isLoading = isLoading;
	}
	
	changePassword() {
		if (this.form.invalid) {
			this.notification.error(
				'Change Password Failed',
				'Your information is invalid.'
			);
			return;
		}
		
		if (this.userUpdatedPassword.value !== this.userConfirmedPassword.value) {
			this.notification.error(
				'Change Password Failed',
				'Your confirmed password is not match.'
			);
			return;
		}
		
		this.load(true);
		this.userService
			.resetPassword(
				this.userEmail.value,
				this.userUpdatedPassword.value,
				this.userConfirmedPassword.value,
				this.userConfirmationCode.value
			)
			.pipe(
				tap({
					next: (res) => {
						if (res.success) {
							this.notification.success(
								'Change Password Success',
								'Your password is updated successfully. Let\'s use new info to login.'
							);
							this.isDisabled = true;
						} else {
							this.notification.error('Change Password Failed', res.error);
						}
					},
					error: (error) => {
						this.notification.error(
							'Change Password Failed',
							'Some thing wrong'
						);
						console.log(error);
					},
					finalize: () => {
						this.load(false);
						this.form.reset();
						this.router.navigateByUrl(this.route.LOGIN);
					},
				})
			)
			.subscribe();
	}
}
