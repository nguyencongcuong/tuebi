import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { map, Observable } from 'rxjs';
import { ENTITY } from 'src/app/modules/categories/categories.module';
import { Tag } from '../interfaces/tag.interface';
import { TagService } from './tag.service'

@Injectable()
export class TagDataService extends DefaultDataService<Tag> {
	tagsHttpService;
	
	constructor(
		http: HttpClient,
		httpUrlGenerator: HttpUrlGenerator
	) {
		super(ENTITY.TAGS, http, httpUrlGenerator);
		this.tagsHttpService = new TagService(http);
	}
	
	override getAll(): Observable<Tag[]> {
		return this.tagsHttpService.readAll().pipe(map((res) => res.data));
	}
	
	override add(entity: Tag): Observable<Tag> {
		return this.tagsHttpService.createOne(entity).pipe(map(res => res.data));
	}
	
	override update(entity: Update<Tag>): Observable<Tag> {
		return this.tagsHttpService.updateOne(entity.changes);
	}
	
	override delete(key: string): Observable<string> {
		return this.tagsHttpService.deleteOne(key);
	}
	
}