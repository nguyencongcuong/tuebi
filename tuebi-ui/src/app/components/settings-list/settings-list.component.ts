import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { themes } from 'src/app/contansts/theme';

@Component({
  selector: 'app-settings-list',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss']
})
export class SettingsListComponent {
  theme = themes[0];
  items = [
    {
      title: 'General',
      routerLink: '/space/settings/general',
      icon: 'user'
    },
    {
      title: 'Appearance',
      routerLink: '/space/settings/appearance',
      icon: 'slider'
    },
    {
      title: 'Import/Export',
      routerLink: '/space/settings/import-export',
      icon: 'export'
    },
    {
      title: 'About Tuebi',
      routerLink: '/space/settings/about',
      icon: 'info'
    }
  ]

}
