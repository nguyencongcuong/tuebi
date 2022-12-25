import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { ROUTE } from '../../enums/routes.enum';

@Component({
  selector: 'app-xs-space',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './page-xs-space.component.html',
  styleUrls: ['./page-xs-space.component.scss']
})
export class PageXsSpaceComponent {
  ROUTE = ROUTE;
  
  items = [
    {
      title: '',
      routerLink: `${ROUTE.CATEGORIES}`,
      icon: 'bookmark'
    },
    {
      title: '',
      routerLink: `${ROUTE.SETTINGS}`,
      icon: 'settings'
    },
  ]
}
