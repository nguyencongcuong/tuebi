import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../commons/logo/logo.component';
import { themes } from '../../../enums/theme.enum';

@Component({
	selector: 'app-page-contact',
	standalone: true,
	imports: [CommonModule, LogoComponent, RouterModule],
	templateUrl: './page-contact.component.html',
	styleUrls: ['./page-contact.component.scss'],
})
export class PageContactComponent {
	theme = themes[0];
}
