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

@Component({
	standalone: true,
	selector: 'app-form-signup',
	templateUrl: './page-signup.component.html',
	styleUrls: ['./page-signup.component.scss'],
	imports: [
		CommonModule,
		RouterModule,
		NzZorroModule,
		ReactiveFormsModule,
		FormsModule,
	],
	providers: [NzNotificationService],
})
export class PageSignupComponent implements OnInit {
	form: FormGroup;
	confirmationForm;
	theme = themes[0];
	
	isSignedUp: boolean = false;
	isConfirmed: boolean = false;
	isLoading: boolean = false;
	
	route = ROUTE;
	
	constructor(
		private authService: AuthService,
		private fb: FormBuilder,
		private router: Router,
		private notification: NzNotificationService
	) {
		this.form = this.fb.group({
			user_email: ['', [Validators.required, Validators.email]],
			user_password: ['', [Validators.required]],
			user_confirmed_password: ['', [Validators.required]],
		});
		
		this.confirmationForm = this.fb.group({
			user_confirmation_code: ['', [Validators.required]],
		});
	}
	
	get email() {
		return this.form.controls['user_email'];
	}
	
	get password() {
		return this.form.controls['user_password'];
	}
	
	get confirmedPassword() {
		return this.form.controls['user_confirmed_password'];
	}
	
	ngOnInit(): void {
		this.form.valueChanges.subscribe((form) => console.log(form));
		this.confirmationForm.valueChanges.subscribe();
	}
	
	signup() {
		if (
			!this.email.value &&
			!this.password.value &&
			!this.confirmedPassword.value
		) {
			this.notification.info(
				'Sign up Failed',
				'You need to fill the form to complete the registration.'
			);
			return;
		}
		
		if (this.form.invalid) {
			this.notification.info(
				'Sign up Failed',
				'Your provided information is not valid.'
			);
			return;
		}
		
		if (
			this.form.value.user_password !== this.form.value.user_confirmed_password
		) {
			this.form.patchValue({
				user_password: '',
				user_confirmed_password: '',
			});
			this.notification.error(
				'Signup Failed',
				'Your confirmed password is not match.'
			);
			return;
		}
		
		localStorage.clear();
		
		this.load(true);
		
		const payload = {
			user_email: this.form.value.user_email as string,
			user_password: this.form.value.user_password as string,
		};
		
		this.authService
			.signup(payload)
			.pipe(
				tap({
					next: (res) => {
						if (res.success) {
							this.isSignedUp = true;
						} else {
							this.notification.error('Sign up Failed', res.error);
						}
					},
					error: (err) => {
						this.notification.error('Sign up Failed', err.message);
					},
					finalize: () => {
						this.load(false);
					},
				})
			)
			.subscribe();
	}
	
	confirm(): void {
		this.authService
			.confirm({
				user_email: this.form.value.user_email as string,
				user_confirmation_code: this.confirmationForm.value
					.user_confirmation_code as string,
			})
			.pipe(
				tap({
					next: (res) => {
						if (res.success) {
							this.isConfirmed = true;
							this.notification.success(
								'Signup Successfully',
								'Your account has been verified. You can login now.'
							);
						}
					},
					error: (err) => {
						this.notification.error('Signup Failed', err.message);
					},
				})
			)
			.subscribe();
	}
	
	load(isLoading: boolean) {
		this.isLoading = isLoading;
	}
}
