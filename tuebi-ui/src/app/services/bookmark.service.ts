import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class BookmarkService {
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
	
	createOne(entity: Bookmark): Observable<any> {
		const options = this.genOptions();
		const url = `${this.API_URL}/bookmarks`;
		return this.http.post(url, entity, options);
	}
	
	readAll(): Observable<any> {
		const options = this.genOptions();
		const url = `${this.API_URL}/bookmarks`;
		return this.http.get(url, options);
	}
	
	updateOne(entity: Partial<Bookmark>): Observable<any> {
		const options = this.genOptions();
		const {id, ...body} = entity;
		const url = this.API_URL + `/bookmarks/${id}`;
		return this.http.put(url, body, options);
	}
	
	deleteOne(id: string): Observable<any> {
		const options = this.genOptions();
		const url = this.API_URL + `/bookmarks/${id}`;
		return this.http.delete(url, options);
	}
	
	getFavicon(domain: string) {
		try {
			return `https://www.google.com/s2/favicons?domain=${domain}`;
		} catch (e) {
			return undefined;
		}
	}
}
