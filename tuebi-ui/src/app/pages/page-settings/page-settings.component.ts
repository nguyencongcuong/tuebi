import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { themes } from '../../enums/theme.enum';
import { IconComponent } from '../../components/icon/icon.component';
import { BreakpointService } from '../../services/breakpoint.service';
import { PageXsSettingsComponent } from '../page-xs-settings/page-xs-settings.component';

@Component({
  selector: 'app-settings-list',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, PageXsSettingsComponent],
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.scss']
})
export class PageSettingsComponent {
  theme = themes[0];
  items = [
    {
      title: 'Appearance',
      routerLink: '/space/settings/appearance',
      icon: 'slider'
    },
    {
      title: 'Privacy and Security',
      routerLink: '/space/settings/privacy-security',
      icon: 'lock'
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
  
  isXs$;
  
  constructor(
    private breakpointService: BreakpointService
  ) {
    this.isXs$ = this.breakpointService.isXs;
  }

}
