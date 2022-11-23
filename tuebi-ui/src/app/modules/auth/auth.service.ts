import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ROUTE } from '../../contansts/routes';
import { AppState } from '../../reducers';
import { logout } from './auth.actions';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	API_URL = environment.backend_url;
	
	isLoggedIn = new BehaviorSubject<boolean>(false);
	
	constructor(
		private http: HttpClient,
		private router: Router,
		private store: Store<AppState>
	) {}
	
	login(
		userEmail: string | null | undefined,
		userPassword: string | null | undefined
	): Observable<any> {
		try {
			const url = `${this.API_URL}/auth/login`;
			const body = {
				user_email: userEmail,
				user_password: userPassword,
			};
			return this.http.post(url, body);
		} catch (e: any) {
			throw new Error(e);
		}
	}
	
	signup(payload: {
		user_email: string;
		user_password: string;
	}): Observable<any> {
		try {
			const url = `${this.API_URL}/users`;
			return this.http.post(url, payload);
		} catch (e: any) {
			throw new Error(e);
		}
	}
	
	confirm(query: {
		user_email: string;
		user_confirmation_code: string;
	}): Observable<any> {
		const url = `${this.API_URL}/users/confirmation`;
		return this.http.get(url, {
			params: new HttpParams()
				.set('user_email', query.user_email)
				.set('user_confirmation_code', query.user_confirmation_code),
		});
	}
	
	logout() {
		this.isLoggedIn.next(false);
		this.store.dispatch(logout());
		localStorage.clear();
		this.router.navigateByUrl(ROUTE.ROOT);
	}
}
