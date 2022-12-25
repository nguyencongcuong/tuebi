import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { map, Observable } from 'rxjs';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { ENTITY } from 'src/app/modules/categories/categories.module';
import { BookmarkService } from './bookmark.service';

@Injectable()
export class BookmarkDataService extends DefaultDataService<Bookmark> {
	bookmarksHttpService;
	
	constructor(
		http: HttpClient,
		httpUrlGenerator: HttpUrlGenerator
	) {
		super(ENTITY.BOOKMARKS, http, httpUrlGenerator);
		this.bookmarksHttpService = new BookmarkService(http);
	}
	
	override getAll(): Observable<Bookmark[]> {
		return this.bookmarksHttpService.readAll().pipe(map((res) => res.data));
	}
	
	override add(entity: Bookmark): Observable<Bookmark> {
		return this.bookmarksHttpService.createOne(entity).pipe(map(res => res.data));
	}
	
	override update(entity: Update<Bookmark>): Observable<Bookmark> {
		return this.bookmarksHttpService.updateOne(entity.changes);
	}
	
	override delete(key: string): Observable<string> {
		return this.bookmarksHttpService.deleteOne(key);
	}
	
}