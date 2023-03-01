import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
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
  
  logout(): void {
    this.msalService.logoutRedirect();
  }
}
