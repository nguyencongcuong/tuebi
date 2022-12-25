import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { ROUTE } from '../../enums/routes.enum';
import { AuthActions } from './auth.action-types';

/*
 * Just like any other singular service we can inject here in the constructor any Angular service,
 * But it's important that we DON'T take this class, and we inject it in other parts of our application
 */

@Injectable()
export class AuthEffects {
	
	/*
	 * Side Effect: After the action dispatched,
	 * Save authenticated user response to local storage
	 */
	
	login$ = createEffect(() => {
			return this.action$.pipe(
				ofType(AuthActions.login),
				tap((action) => {
					localStorage.setItem(
						'auth',
						JSON.stringify(action.user)
					);
				})
			);
		},
		{dispatch: false});
	
	
	/*
	 * Side Effect: After the action dispatched,
	 * Save authenticated user response to local storage
	 */
	
	logout$ = createEffect(() => {
			return this.action$
				.pipe(
					ofType(AuthActions.logout),
					tap(() => {
						localStorage.removeItem('auth');
						this.router.navigateByUrl(ROUTE.ROOT);
					})
				);
		},
		{dispatch: false}
	);
	
	constructor(
		private action$: Actions,
		private router: Router,
	) { }
}
