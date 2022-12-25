import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { SettingsListComponent } from 'src/app/components/settings-list/settings-list.component';
import { ROUTE } from 'src/app/contansts/routes';

@Component({
  selector: 'app-xs-setting-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsListComponent, IconComponent],
  templateUrl: './xs-setting-list.component.html',
  styleUrls: ['./xs-setting-list.component.scss']
})
export class XsSettingListComponent {
  ROUTE = ROUTE;
  items = [
    {
      title: 'General',
      routerLink: 'general',
      icon: 'user'
    },
    {
      title: 'Appearance',
      routerLink: 'appearance',
      icon: 'slider'
    },
    {
      title: 'Import/Export',
      routerLink: 'import-export',
      icon: 'export'
    },
    {
      title: 'About Tuebi',
      routerLink: 'about',
      icon: 'info'
    }
  ]
}
