import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthedUserI } from 'src/app/modules/auth/auth.models';
import { Category } from 'src/app/modules/categories/categories.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CategoriesService {
	public API_URL = environment.backend_url;
	
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
