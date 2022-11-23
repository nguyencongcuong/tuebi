import { createAction, props } from '@ngrx/store';
import { AuthedUserI } from './auth.models';

export const login = createAction(
	'[Login Page] User Login',
	props<{ user: AuthedUserI | undefined }>()
);

export const logout = createAction(
	'[Setting Page] User Logout'
);
