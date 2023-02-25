import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tag } from '../interfaces/tag.interface';

@Injectable({
	providedIn: 'root',
})
export class TagService {
	API_URL = environment.backend_url;
	
	constructor(private http: HttpClient) {}
	
	genOptions() {
		const b2cPayload = JSON.parse(localStorage.getItem('b2c_payload') as string)
		return {
			headers: {
				Authorization: `Bearer ${b2cPayload.accessToken}`,
			},
		};
	}
	
	createOne(entity: Tag): Observable<any> {
		const options = this.genOptions();
		const url = `${this.API_URL}/tags`;
		return this.http.post(url, entity, options);
	}
	
	readAll(): Observable<any> {
		const options = this.genOptions();
		const url = `${this.API_URL}/tags`;
		return this.http.get(url, options);
	}
	
	updateOne(entity: Partial<Tag>): Observable<any> {
		const options = this.genOptions();
		const {id, ...body} = entity;
		const url = this.API_URL + `/tags/${id}`;
		return this.http.put(url, body, options);
	}
	
	deleteOne(id: string): Observable<any> {
		const options = this.genOptions();
		const url = this.API_URL + `/tags/${id}`;
		return this.http.delete(url, options);
	}
}
