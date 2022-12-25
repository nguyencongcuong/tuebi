import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../interfaces/auth.interface';

/*
 * By using Feature Selector, we can add safe type to our auth state.
 * This help reduce type error and show code completion for the state's properties
 *
 * Example:
 * (state) => state['auth'] is replaced with selectAuthState for type safe coding
 */
export const selectAuthState = createFeatureSelector<AuthState>('auth');

/*
 * By using createSelector, the value of state will be in-memory stored.
 * If the input remains the same across multiple values emitted by the store,
 * then we are not going to repeat the calculation of the derived state.
 */

export const isLoggedIn = createSelector(
	selectAuthState,
	(auth) => !!auth.user // Optimized calculation
);

export const isLoggedOut = createSelector(
	isLoggedIn,
	(isLoggedIn) => !isLoggedIn // Optimized calculation
);

export const authedUser = createSelector(
	selectAuthState,
	(auth) => auth.user // Optimized calculation
);
