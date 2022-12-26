import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ROUTE } from '../../enums/routes.enum';
import { IconComponent } from '../../components/icon/icon.component';
import { PageSettingsComponent } from '../page-settings/page-settings.component';

@Component({
  selector: 'app-xs-setting-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PageSettingsComponent, IconComponent, NzDividerModule],
  templateUrl: './page-xs-settings.component.html',
  styleUrls: ['./page-xs-settings.component.scss']
})
export class PageXsSettingsComponent {
  ROUTE = ROUTE;
  groupOne = [
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
      title: 'Privacy and Security',
      routerLink: 'privacy-security',
      icon: 'lock'
    }
  ]
  groupTwo = [
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
