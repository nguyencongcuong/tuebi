import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category.interface';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {
	public API_URL = environment.backend_url;
	
	constructor(
		private http: HttpClient,
		private msalService: MsalService
	) {}
	
	genOptions() {
		const b2cPayload = JSON.parse(localStorage.getItem('b2c_payload') as string);
		return {
			headers: {
				Authorization: `Bearer ${b2cPayload.accessToken}`,
			},
		};
	}
	
	test() {
		const token = this.msalService.instance.acquireTokenSilent({scopes: []});
		console.log('token', token)
		const url = `${this.API_URL}/categories-test`;
		return this.http.get(url);
	}
	
	createOne(entity: Category): Observable<any> {
		const options = this.genOptions();
		const url = `${this.API_URL}/categories`;
		return this.http.post(url, entity, options);
	}
	
	readAll(): Observable<any> {
		const options = this.genOptions();
		const url = this.API_URL + '/categories';
		return this.http.get(url, options);
	}
	
	updateOne(entity: Partial<Category>): Observable<any> {
		const options = this.genOptions();
		const {id, ...body} = entity;
		const url = this.API_URL + `/categories/${id}`;
		return this.http.put(url, body, options);
	}
	
	deleteOne(id: string): Observable<any> {
		const options = this.genOptions();
		const url = this.API_URL + `/categories/${id}`;
		return this.http.delete(url, options);
	}
}
