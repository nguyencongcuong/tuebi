import { Component, isDevMode, OnInit } from '@angular/core';
import {
	ActivatedRoute,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { features, featuresAtGlance } from './contansts/features';
import { ROUTE, routeList } from './contansts/routes';
import { themes } from './contansts/theme';
import { login } from './modules/auth/auth.actions';
import { AuthService } from './modules/auth/auth.service';
import { AppState } from './reducers';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	isLoggedIn$ = this.authService.isLoggedIn;
	
	isLoading: boolean = false;
	
	title = 'tuebi.io';
	desc_1 = 'Your daily bookmark manager';
	desc_2 = 'Private. Minimal. Efficient';
	year = new Date().getFullYear();
	theme = themes[0];
	currentUrl = '/';
	
	ROUTE = ROUTE;
	isShown: boolean = false;
	features = features;
	featuresAtGlance = featuresAtGlance;
	routeList = routeList;
	
	constructor(
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>
	) {}
	
	ngOnInit() {
		if (isDevMode()) {
			console.log('Development!');
		} else {
			console.log('Production!');
		}
		
		const auth = localStorage.getItem('auth');
		
		if (auth && auth !== 'undefined') {
			this.authService.isLoggedIn.next(true);
			const user = JSON.parse(auth);
			this.store.dispatch(login({user: user}));
			this.router.navigateByUrl(ROUTE.SPACE + '/categories/all');
		} else {
			localStorage.removeItem('auth');
		}
		
		this.route.params.subscribe((res) => {
			console.log('pram', res);
		});
		
		this.router.events.subscribe((event: any) => {
			switch (true) {
				case event instanceof NavigationStart: {
					this.isLoading = true;
					break;
				}
				case event instanceof NavigationEnd:
				case event instanceof NavigationCancel:
				case event instanceof NavigationError: {
					this.isLoading = false;
					console.log('event', event.url);
					this.currentUrl = event.url;
					break;
				}
				default: {
					break;
				}
			}
		});
	}
	
	toggleNav(bool: boolean) {
		this.isShown = !bool;
	}
}
