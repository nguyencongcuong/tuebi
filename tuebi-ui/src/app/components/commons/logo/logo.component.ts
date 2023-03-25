import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { route } from '../../../enums/routes.enum';

@Component({
	standalone: true,
	selector: 'app-logo',
	imports: [CommonModule, RouterModule],
	templateUrl: './logo.component.html',
	styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
	@Input() light: boolean = false;
	public route = route;
	
}
