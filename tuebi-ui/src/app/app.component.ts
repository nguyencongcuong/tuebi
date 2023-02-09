import { Component, isDevMode, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { AppState } from './reducers';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>,
		private breakpointService: BreakpointService,
	) {
		this.breakpointService.ngOnInit();
	}
	
	ngOnInit(): void {
		isDevMode() ? console.log('Development!') : console.log('Production!');
	}
}