import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
	templateUrl: './page-password-reset-request.component.html',
	styleUrls: ['./page-password-reset-request.component.scss'],
})
export class PagePasswordResetRequestComponent implements OnInit {
	theme = themes[0];
	route = ROUTE;
	form: FormGroup;
	
	isLoading = false;
	isDisabled = true;
	isEmailSent = false;
	
	constructor(
		private authService: AuthService,
		private userService: UserService,
		private fb: FormBuilder,
		private notification: NzNotificationService
	) {
		this.form = this.fb.group({
			user_email: ['', [Validators.email]],
		});
	}
	
	get userEmail() {
		return this.form.controls['user_email'];
	}
	
	ngOnInit(): void {
		this.form.valueChanges.subscribe(() => {
			this.isDisabled = !(this.userEmail.valid && this.userEmail.value);
		});
	}
	
	sendEmail() {
		this.load(true);
		this.userService
			.sendPasswordResetRequestEmail(this.userEmail.value)
			.pipe(
				tap({
					next: (res) => {
						if (res.success) {
							this.load(false);
							this.isEmailSent = true;
						} else {
							this.notification.error('Password Reset Failed', res.error);
						}
					},
					error: () => {
						this.notification.error(
							'Password Reset Failed',
							'Something wrong. Please try again later.'
						);
					},
					finalize: () => {
						console.log('Request for Password Reset Email Sent!');
						this.load(false);
					},
				})
			)
			.subscribe();
	}
	
	load(isLoading: boolean) {
		this.isLoading = isLoading;
	}
	
	retry() {
		this.isLoading = false;
		this.isDisabled = true;
		this.isEmailSent = false;
		this.form.reset();
	}
}
