import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { filter, first, Observable, tap } from 'rxjs';
import { BookmarksEntityService } from './bookmarks-entity.service';
import { CategoriesEntityService } from './categories-entity.service';
import { UserEntityService } from './user-entity.service';
import { UserService } from './user.service';

@Injectable()
export class CategoriesResolver implements Resolve<boolean> {
	constructor(
		private userService: UserService,
		private userEntityService: UserEntityService,
		private categoryEntityService: CategoriesEntityService,
		private bookmarksEntityService: BookmarksEntityService
	) {
	}
	
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		
		return this.categoryEntityService.loaded$.pipe(
			// Only fetch data when loaded = true
			tap(loaded => {
				if (!loaded) {
					this.categoryEntityService.getAll();
					this.bookmarksEntityService.getAll();
					const authedUser = this.userService.getAuthedUser();
					if (authedUser) {
						this.userEntityService.getByKey(authedUser.id);
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