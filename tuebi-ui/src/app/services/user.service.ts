import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { AuthedUserI } from 'src/app/modules/auth/auth.models';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	API_URL = environment.backend_url;
	
	constructor(private http: HttpClient) {}
	
	genOptions() {
		const authedUser = JSON.parse(
			localStorage.getItem('auth') as string
		) as AuthedUserI;
		const token = authedUser?.access_token || '';
		return {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
	}
	
	readOne(): Observable<any> {
		const options = this.genOptions();
		const url = this.API_URL + `/users`;
		return this.http.get(url, options);
	}
	
	updateOne(entity: Partial<User>): Observable<any> {
		const options = this.genOptions();
		const {id, ...body} = entity;
		const url = this.API_URL + `/users`;
		return this.http.put(url, body, options);
	}
	
	deleteOne(id: string): Observable<any> {
		const options = this.genOptions();
		const url = this.API_URL + `/users`;
		return this.http.delete(url, options);
	}
	
	sendPasswordResetRequestEmail(userEmail: string): Observable<any> {
		const url = this.API_URL + '/users/pw/reset';
		const options = {
			params: {
				user_email: userEmail,
			},
		};
		return this.http.get(url, options);
	}
	
	resetPassword(
		userEmail: string,
		userUpdatedPassword: string,
		userConfirmedPassword: string,
		userConfirmationCode: string
	): Observable<any> {
		const body = {
			user_email: userEmail,
			user_updated_password: userUpdatedPassword,
			user_confirmed_password: userConfirmedPassword,
			user_confirmation_code: userConfirmationCode,
		};
		const url = this.API_URL + '/users/pw/update';
		return this.http.put(url, body);
	}
	
	getAuthedUser() {
		return JSON.parse(localStorage.getItem('auth') as string) as AuthedUserI;
	}
}
