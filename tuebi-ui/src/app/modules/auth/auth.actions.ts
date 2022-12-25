import { createAction, props } from '@ngrx/store';
import { AuthedUserI } from '../../interfaces/auth.interface';

export const login = createAction(
	'[Login Page] User Login',
	props<{ user: AuthedUserI | undefined }>()
);

export const logout = createAction(
	'[Setting Page] User Logout'
);
