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
import { AUTH_LOCAL_STORAGE_KEY } from 'src/app/enums/authorization.enum';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { featuresEnum, featuresAtGlance } from './enums/features.enum';
import { ROUTE, routeList } from './enums/routes.enum';
import { themes } from './enums/theme.enum';
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
	features = featuresEnum;
	featuresAtGlance = featuresAtGlance;
	routeList = routeList;
	
	constructor(
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>,
		private breakpointService: BreakpointService
	) {
		this.breakpointService.ngOnInit()
	}
	
	ngOnInit() {
		if (isDevMode()) {
			console.log('Development!');
		} else {
			console.log('Production!');
		}
		
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
		
		const auth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
		
		if(!auth) {
			return;
		}
		
		if(auth && auth === 'undefined') {
			this.authService.isLoggedIn.next(false);
			localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
			this.router.navigateByUrl(ROUTE.LOGIN);
			return;
		}
		
		this.authService.validateJWT().subscribe({
			next: () => {
				this.authService.isLoggedIn.next(true);
				const user = JSON.parse(auth);
				this.store.dispatch(login({user: user}));
				this.breakpointService.isXs.subscribe(isXs => {
					isXs 
						? this.router.navigateByUrl(`m/${ROUTE.SPACE}/${ROUTE.CATEGORIES}`)
						: this.router.navigateByUrl(`${ROUTE.SPACE}/${ROUTE.CATEGORIES}/all`)
				}).unsubscribe();
			},
			error: (error) => {
				console.log('ERROR', error);
				this.authService.isLoggedIn.next(false);
				localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
				this.router.navigateByUrl(ROUTE.LOGIN);
			}
		})
	}
	
	toggleNav(bool: boolean) {
		this.isShown = !bool;
	}
}