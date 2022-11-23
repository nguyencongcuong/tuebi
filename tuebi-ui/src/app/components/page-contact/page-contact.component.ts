import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTE } from '../../contansts/routes';
import { themes } from '../../contansts/theme';
import { LogoComponent } from '../logo/logo.component';

@Component({
	selector: 'app-page-contact',
	standalone: true,
	imports: [CommonModule, LogoComponent, RouterModule],
	templateUrl: './page-contact.component.html',
	styleUrls: ['./page-contact.component.scss'],
})
export class PageContactComponent {
	theme = themes[0];
	route = ROUTE;
}
