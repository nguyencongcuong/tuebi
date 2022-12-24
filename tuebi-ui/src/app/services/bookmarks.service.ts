import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { AuthedUserI } from 'src/app/modules/auth/auth.models';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class BookmarksService {
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
