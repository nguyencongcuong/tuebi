import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { filter, first, Observable, tap } from 'rxjs';
import { BookmarkEntityService } from './bookmark-entity.service';
import { CategoryEntityService } from './category-entity.service';
import { UserEntityService } from './user-entity.service';
import { UserService } from './user.service';

@Injectable()
export class CategoryResolver implements Resolve<boolean> {
	constructor(
		private userService: UserService,
		private userEntityService: UserEntityService,
		private categoryEntityService: CategoryEntityService,
		private bookmarkEntityService: BookmarkEntityService
	) {
	}
	
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		
		return this.categoryEntityService.loaded$.pipe(
			// Only fetch data when loaded = true
			tap(loaded => {
				if (!loaded) {
					this.categoryEntityService.getAll();
					this.bookmarkEntityService.getAll();
					const b2cPayload = this.userService.getAuthedUser();
					if (b2cPayload) {
						this.userEntityService.getByKey(b2cPayload.uniqueId);
					} else {
						localStorage.removeItem('auth');
					}
				}
			}),
			// Wait for the data to be loaded in the store
			filter(loaded => !!loaded),
			// Complete the observable and make sure the transition go through
			first()
		);
	}
}