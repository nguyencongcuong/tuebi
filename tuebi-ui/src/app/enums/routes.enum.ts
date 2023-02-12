export enum ROUTE {
	ROOT = '',
	SIGNUP = 'signup',
	ABOUT = 'about',
	CONTACT = 'contact',
	SPACE = 'space',
	CATEGORIES = 'categories',
	SEARCH = 'search',
	
	SETTINGS = 'settings',
	SETTINGS_GENERAL = 'general',
	SETTINGS_APPEARANCE = 'appearance',
	SETTINGS_ABOUT = 'about',
	SETTINGS_IMPORT_EXPORT = 'import-export',
	SETTINGS_PRIVACY_SECURITY = 'privacy-security'
}

export const routeList = [
	{
		name: 'About',
		routerLink: ROUTE.ABOUT,
	},
	{
		name: 'Contact',
		routerLink: ROUTE.CONTACT,
	}
];
