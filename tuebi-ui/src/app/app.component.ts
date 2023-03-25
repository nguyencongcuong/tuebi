import { Component, Inject, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
	private _destroying$ = new Subject<void>();

	constructor(
		@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
		private breakpointService: BreakpointService,
		private msalService: MsalService,
		private msalBroadcastService: MsalBroadcastService,
		private userService: UserService,
		public authService: AuthService
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
				this.userService.createOne(payload).subscribe((res) => {
					if(res.success) {
						// Do something here

					}
				});
			});
		
		this.msalBroadcastService.inProgress$
			.pipe(
				filter((status: InteractionStatus) => status === InteractionStatus.None),
				takeUntil(this._destroying$)
			)
			.subscribe(() => {
				this.setLoginDisplay();
			})
		
	}
	
	ngOnDestroy(): void {
		this._destroying$.next(undefined);
		this._destroying$.complete();
	}
	
	setLoginDisplay() {
		this.authService.isB2CLoggedIn$.next(this.msalService.instance.getAllAccounts().length > 0) 
	}
}