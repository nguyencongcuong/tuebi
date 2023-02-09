import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { map, Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category.interface';
import { ENTITY } from 'src/app/modules/categories/categories.module';
import { CategoryService } from './category.service';

@Injectable()
export class CategoryDataService extends DefaultDataService<Category> {
	private categoriesHttpService;
	
	constructor(
		http: HttpClient,
		httpUrlGenerator: HttpUrlGenerator,
		msalService: MsalService,
	) {
		super(ENTITY.CATEGORIES, http, httpUrlGenerator);
		this.categoriesHttpService = new CategoryService(http, msalService);
	}
	
	override add(entity: Category): Observable<Category> {
		return this.categoriesHttpService.createOne(entity).pipe(map(res => res.data));
	}
	
	override getAll(): Observable<Category[]> {
		return this.categoriesHttpService.readAll().pipe(map((res) => res.data));
	}
	
	override update(entity: Update<Category>): Observable<Category> {
		return this.categoriesHttpService.updateOne(entity.changes).pipe(map((res) => res.data));
	}
	
	override delete(key: string): Observable<string> {
		return this.categoriesHttpService.deleteOne(key);
	}
	
}