import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ROUTE } from 'src/app/contansts/routes';
import { NgIconModule } from 'src/app/ng-icon.module';

@Component({
  selector: 'app-xs-space',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconModule],
  templateUrl: './xs-space.component.html',
  styleUrls: ['./xs-space.component.scss']
})
export class XsSpaceComponent {
  ROUTE = ROUTE;
  
  items = [
    {
      title: '',
      routerLink: `${ROUTE.CATEGORIES}`,
      icon: 'circum-bookmark'
    },
    {
      title: '',
      routerLink: `${ROUTE.SETTINGS}`,
      icon: 'circum-settings'
    },
  ]
}
