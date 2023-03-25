import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { filter } from 'rxjs';
import { featuresAtGlance, featuresEnum } from '../../../enums/features.enum';
import { AuthService } from '../../../services/auth.service';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { HeaderComponent } from '../../layouts/header/header.component';
import { IconComponent } from '../../commons/icon/icon.component';
import { LogoComponent } from '../../commons/logo/logo.component';

@Component({
  selector: 'app-page-home',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterLinkActive, RouterLink, IconComponent, NzButtonModule, NzIconModule, NzMenuModule, NzToolTipModule, NzSpinModule, HeaderComponent, FooterComponent],
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {
  public currentUrl = '/';
  public features = featuresEnum;
  public featuresAtGlance = featuresAtGlance;
  public isLoading = true;
  
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    public authService: AuthService
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
          this.authService.isB2CLoggedIn$.next(true)
        } else {
          this.isLoading = false;
        }
      });
  }
}
