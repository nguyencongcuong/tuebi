import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const tokenExpiration = this.authService.getTokenExpiration();
    const currentEpochTime = Math.floor((new Date().getTime()) / 1000); // In Minutes
    if (tokenExpiration && tokenExpiration < currentEpochTime) {
      this.authService.logout();
      return false;
    }
    return true;
  }
}
