import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsListComponent } from 'src/app/components/settings-list/settings-list.component';
import { ROUTE } from 'src/app/contansts/routes';
import { NgIconModule } from 'src/app/ng-icon.module';

@Component({
  selector: 'app-xs-setting-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsListComponent, NgIconModule],
  templateUrl: './xs-setting-list.component.html',
  styleUrls: ['./xs-setting-list.component.scss']
})
export class XsSettingListComponent {
  ROUTE = ROUTE;
  items = [
    {
      title: 'General',
      routerLink: 'general',
      icon: 'circum-user'
    },
    {
      title: 'Appearance',
      routerLink: 'appearance',
      icon: 'circum-slider-horizontal'
    },
    {
      title: 'Import/Export',
      routerLink: 'import-export',
      icon: 'circum-export'
    },
    {
      title: 'About Tuebi',
      routerLink: 'about',
      icon: 'circum-circle-info'
    }
  ]
}
