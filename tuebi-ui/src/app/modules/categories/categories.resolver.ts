import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { filter, first, Observable, tap } from 'rxjs';
import { BookmarkEntityService } from '../../services/bookmark-entity.service';
import { CategoriesEntityService } from './categories.entity.service';
import { TagEntityService } from '../../services/tag-entity.service';
import { UserEntityService } from '../../services/user-entity.service';
import { UserService } from '../../services/user.service';

@Injectable()
export class CategoriesResolver implements Resolve<boolean> {
	constructor(
		private userService: UserService,
		private userEntityService: UserEntityService,
		private categoryEntityService: CategoriesEntityService,
		private bookmarkEntityService: BookmarkEntityService,
		private tagEntityService: TagEntityService,
	) {
	}
	
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		
		return this.categoryEntityService.loaded$.pipe(
			// Only fetch data when loaded = true
			tap(loaded => {
				if (!loaded) {
					this.categoryEntityService.getAll();
					this.bookmarkEntityService.getAll();
					this.tagEntityService.getAll();
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