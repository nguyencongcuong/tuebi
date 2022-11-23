export enum ROUTE {
	ROOT = '',
	BOOKMARKS = 'bookmarks',
	LOGIN = 'login',
	PASSWORD_RESET_REQUEST = 'password-reset',
	PASSWORD_RESET = 'pw/reset',
	SIGNUP = 'signup',
	ABOUT = 'about',
	HELP = 'help',
	CONTACT = 'contact',
	PRIVACY_POLICY = 'privacy',
	LEGAL_NOTICE = 'legal',
	SPACE = 'space',
	CATEGORIES = 'categories',
	
	SETTINGS = 'settings',
	SETTINGS_GENERAL = 'general',
	SETTINGS_APPEARANCE = 'appearance',
	SETTINGS_ABOUT = 'about',
	SETTINGS_IMPORT_EXPORT = 'import-export',
}

export const routeList = [
	{
		name: 'About',
		routerLink: ROUTE.ABOUT,
	},
	{
		name: 'Contact',
		routerLink: ROUTE.CONTACT,
	},
	{
		name: 'Login',
		routerLink: ROUTE.LOGIN,
	},
	{
		name: 'Sign up',
		routerLink: ROUTE.SIGNUP,
	},
];
