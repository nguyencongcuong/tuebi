import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.action-types';
import { AuthState } from './auth.models';

export const initialAuthState: AuthState = {
	user: undefined
};

export const authReducer = createReducer(
	initialAuthState,
	
	on(AuthActions.login, (state, action) => {
		return {
			user: action.user
		};
	}),
	
	on(AuthActions.logout, (state, action) => {
		return {
			user: undefined
		};
	})
);
