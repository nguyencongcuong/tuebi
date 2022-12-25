import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { ROUTE } from 'src/app/contansts/routes';

@Component({
  selector: 'app-xs-space',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './xs-space.component.html',
  styleUrls: ['./xs-space.component.scss']
})
export class XsSpaceComponent {
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
