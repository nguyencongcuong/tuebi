import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class SubscriptionService {
	API_URL = environment.backend_url;
	
	constructor(
		private http: HttpClient
	) {
	}
	
	findOneSubscriptionById(id: string): Observable<any> {
		const token = localStorage.getItem('token');
		const url = this.API_URL + `/subscriptions/${id}`;
		const options = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		return this.http.get(url, options);
	}
}
