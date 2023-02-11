import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	API_URL = environment.backend_url;
	
	constructor(
		private http: HttpClient,
	) {}
	
	genOptions() {
		const b2cPayload = JSON.parse(localStorage.getItem('b2c_payload') as string);
		return {
			headers: {
				Authorization: `Bearer ${b2cPayload.accessToken}`,
			},
		};
	}
	
	createOne(payload: any): Observable<any> {
		const url = this.API_URL + `/users`;
		const body = {
			user_object_id: payload.account.idTokenClaims.oid,
			user_emails: payload.account.idTokenClaims.emails
		}
		return this.http.post(url, body, {
			headers: {
				Authorization: `Bearer ${payload.accessToken}`,
			},
		});
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
	
	getAuthedUser() {
		return JSON.parse(localStorage.getItem('b2c_payload') as string)
	}
}
