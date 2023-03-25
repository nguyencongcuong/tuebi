import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard {
  constructor(
    private authService: AuthService, 
  ) {}
  
  canActivate(): boolean {
    const tokenExpiration = this.authService.getTokenExpiration();
    const currentEpochTime = Math.floor((new Date().getTime()) / 1000); // In Minutes
    if (tokenExpiration && tokenExpiration < currentEpochTime) {
      this.authService.logout();
      return false;
    }
    console.log('auth ran canactive')
    return true;
  }
}
