import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { tap } from 'rxjs';
import { ROUTE } from 'src/app/contansts/routes';
import { login } from 'src/app/modules/auth/auth.actions';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { themes } from '../../contansts/theme';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../modules/auth/auth.service';
import { NzZorroModule } from '../../nz-zorro.module';

@Component({
	standalone: true,
	selector: 'app-form-login',
	templateUrl: './form-login.component.html',
	styleUrls: ['./form-login.component.scss'],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
		StoreModule,
		NzZorroModule,
	],
	providers: [NzNotificationService],
})
export class FormLoginComponent {
	form: FormGroup;
	theme = themes[0];
	route = ROUTE;
	isLoading = false;
	
	isXs$;
	
	constructor(
		private authService: AuthService,
		private fb: FormBuilder,
		private router: Router,
		private notification: NzNotificationService,
		private store: Store<{ user: User }>,
		private breakpointService: BreakpointService,
	) {
		
		this.isXs$ = this.breakpointService.isXs;
		
		this.form = this.fb.group({
			user_email: ['', [Validators.required, Validators.email]],
			user_password: ['', [Validators.required]],
		});
	}
	
	get email() {
		return this.form.controls['user_email'];
	}
	
	get password() {
		return this.form.controls['user_password'];
	}
	
	login() {
		if (!this.email.value && !this.password.value) {
			this.notification.info(
				'Login Failed',
				'Please provide your email & password to login.'
			);
			return;
		}
		
		if (this.form.invalid) {
			this.notification.info('Login Failed', 'Your email/password is invalid.');
			return;
		}
		
		this.load(true);
		
		this.authService
			.login(this.form.value.user_email, this.form.value.user_password)
			.pipe(
				tap({
					next: (res) => {
						if (res.success) {
							this.authService.isLoggedIn.next(true);
							this.store.dispatch(login({user: res.data}));
							this.isXs$.subscribe(isXs => {
								isXs 
									? this.router.navigateByUrl(`m/${ROUTE.SPACE}/${ROUTE.CATEGORIES}`)
									: this.router.navigateByUrl(`${ROUTE.SPACE}/${ROUTE.CATEGORIES}/all`)
							}).unsubscribe();
						} else {
							this.notification.error(
								'Login Failed',
								'Your email/password is incorrect.'
							);
							this.load(false);
						}
					},
					error: (err) => {
						this.notification.error('Login Failed', err.message);
						this.load(false);
					},
				})
			)
			.subscribe();
	}
	
	load(isLoading: boolean) {
		this.isLoading = isLoading;
	}
}
