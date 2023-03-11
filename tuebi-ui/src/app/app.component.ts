import { Component, Inject, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { routeList } from './enums/routes.enum';
import { AppState } from './reducers';
import { UserService } from './services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
	private _destroying$ = new Subject<void>();
	public isB2CLoggedIn = false;
	public isCollapsed = false;
	public routeList = routeList;
	
	constructor(
		@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>,
		private breakpointService: BreakpointService,
		private msalService: MsalService,
		private msalBroadcastService: MsalBroadcastService,
		private userService: UserService,
	) {
		this.breakpointService.ngOnInit();
	}
	
	async ngOnInit(): Promise<void> {
		isDevMode() ? console.log('Development!') : console.log('Production!');
		
		this.msalBroadcastService.msalSubject$
			.pipe(
				filter((msg: EventMessage) => 
					msg.eventType === EventType.LOGIN_SUCCESS ||
					msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
					msg.eventType === EventType.SSO_SILENT_SUCCESS
				),
			)
			.subscribe((result: EventMessage) => {
				console.log('result', result)
				
				// Check database, if this is new user, create an initial user data.
				const payload = result.payload as any;
				localStorage.setItem('b2c_payload', JSON.stringify(payload))
				this.userService.createOne(payload).subscribe();
			});
		
		this.msalBroadcastService.inProgress$
			.pipe(
				filter((status: InteractionStatus) => status === InteractionStatus.None),
				takeUntil(this._destroying$)
			)
			.subscribe(() => {
				this.setLoginDisplay();
				if(this.isB2CLoggedIn) this.router.navigateByUrl('space/categories/all');
			})
	}
	
	ngOnDestroy(): void {
		this._destroying$.next(undefined);
		this._destroying$.complete();
	}
	
	login() {
		if (this.msalGuardConfig.authRequest){
			this.msalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
		} else {
			this.msalService.loginRedirect();
		}
	}
	
	setLoginDisplay() {
		this.isB2CLoggedIn = this.msalService.instance.getAllAccounts().length > 0;
	}
}