import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { ENTITY } from 'src/app/modules/categories/categories.module';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root'
})
export class UserDataService extends DefaultDataService<User> {
	userService;
	
	constructor(
		http: HttpClient,
		httpUrlGenerator: HttpUrlGenerator
	) {
		super(ENTITY.USER, http, httpUrlGenerator);
		this.userService = new UserService(http);
	}
	
	override getById(): Observable<User> {
		return this.userService.readOne().pipe(map(res => res.data));
	}
	
	override update(entity: Update<User>): Observable<User> {
		return this.userService.updateOne(entity.changes);
	}
	
	override delete(key: string): Observable<string> {
		return this.userService.deleteOne(key);
	}
}
