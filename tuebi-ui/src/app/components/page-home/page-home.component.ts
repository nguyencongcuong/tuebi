import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { IconComponent } from '../icon/icon.component';
import { LogoComponent } from '../logo/logo.component';
import { featuresAtGlance, featuresEnum } from '../../enums/features.enum';
import { ROUTE } from '../../enums/routes.enum';
import { themes } from '../../enums/theme.enum';

@Component({
  selector: 'app-page-home',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterLinkActive, RouterLink, IconComponent, NzButtonModule, NzIconModule, NzMenuModule, NzToolTipModule],
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {
  title = 'tuebi.io';
  desc_1 = 'Your daily bookmark manager';
  desc_2 = 'Private. Minimal. Efficient';
  year = new Date().getFullYear();
  theme = themes[0];
  currentUrl = '/';
  
  ROUTE = ROUTE;
  features = featuresEnum;
  featuresAtGlance = featuresAtGlance;
  
  constructor() {}
  
  public ngOnInit() {

  }
}
