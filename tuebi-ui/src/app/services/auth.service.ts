import { Inject, Injectable } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isB2CLoggedIn$ = new BehaviorSubject(false);

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService
  ) { }
  
  getTokenExpiration(): number {
    const accounts = this.msalService.instance.getAllAccounts();
    if(accounts.length) {
      const account = accounts[0];
      return account.idTokenClaims?.exp || 0;
    } else {
      return 0;
    }
  }
  
  login(): void {
    if (this.msalGuardConfig.authRequest){
      this.msalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }
  logout(): void {
    this.msalService.logoutRedirect();
  }
}
