import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, RedirectRequest } from '@azure/msal-browser';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { filter } from 'rxjs';
import { featuresAtGlance, featuresEnum } from '../../enums/features.enum';
import { themes } from '../../enums/theme.enum';
import { IconComponent } from '../icon/icon.component';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-page-home',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterLinkActive, RouterLink, IconComponent, NzButtonModule, NzIconModule, NzMenuModule, NzToolTipModule, NzSpinModule],
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {
  
  theme = themes[0];
  currentUrl = '/';
  
  features = featuresEnum;
  featuresAtGlance = featuresAtGlance;
  
  public isLoading = true;
  public isLoggedIn = false;
  
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) {}
  
  public ngOnInit() {
    if(this.msalService.instance.getAllAccounts().length <= 0) {
      // User is not logged in
      this.isLoading = false;
      console.log('User is not logged In')
    }
    
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => 
          msg.eventType === EventType.LOGIN_SUCCESS
        ),
      )
      .subscribe((msg: EventMessage) => {
        if(msg.eventType === EventType.LOGIN_SUCCESS) {
          this.isLoading = false;
          this.isLoggedIn = true;
        } else {
          this.isLoading = false;
        }
      });
  }
  
  public login() {
    if (this.msalGuardConfig.authRequest){
      this.msalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }
}
