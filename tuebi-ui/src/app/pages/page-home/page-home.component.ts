import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { filter, Subject, takeUntil } from 'rxjs';
import { IconComponent } from '../../components/icon/icon.component';
import { LogoComponent } from '../../components/logo/logo.component';
import { featuresAtGlance, featuresEnum } from '../../enums/features.enum';
import { ROUTE, routeList } from '../../enums/routes.enum';
import { themes } from '../../enums/theme.enum';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-page-home',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterLinkActive, RouterLink, IconComponent, NzButtonModule],
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  
  public isB2CLoggedIn = false;
  
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private userService: UserService
  ) {}
  
  public ngOnInit() {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        console.log('result', result)
      
        // Check database, if this is new user, create an initial user data.
        const payload = result.payload as any;
        localStorage.setItem('b2c_payload', JSON.stringify(payload))
        this.userService.createOne(payload).subscribe();
      });
  
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      })
  }
  
  title = 'tuebi.io';
  desc_1 = 'Your daily bookmark manager';
  desc_2 = 'Private. Minimal. Efficient';
  year = new Date().getFullYear();
  theme = themes[0];
  currentUrl = '/';
  
  ROUTE = ROUTE;
  isShown: boolean = false;
  features = featuresEnum;
  featuresAtGlance = featuresAtGlance;
  routeList = routeList;
  
  login() {
    if (this.msalGuardConfig.authRequest){
      this.msalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }
  
  logout() {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200'
    });
  }
  
  setLoginDisplay() {
    this.isB2CLoggedIn = this.msalService.instance.getAllAccounts().length > 0;
  }
  
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
  
  toggleNav(bool: boolean) {
    this.isShown = !bool;
  }
}
