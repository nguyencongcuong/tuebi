import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { map, Observable, tap } from 'rxjs';
import { FormChangePasswordComponent } from 'src/app/components/form-change-password/form-change-password.component';
import { FormEditProfileComponent } from 'src/app/components/form-edit-profile/form-edit-profile.component';
import { ROUTE } from 'src/app/contansts/routes';
import { User } from 'src/app/interfaces/user.interface';
import { logout } from 'src/app/modules/auth/auth.actions';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { AppState } from 'src/app/reducers';
import { UserEntityService } from 'src/app/services/user-entity.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings-detail-general',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzAvatarModule, NzDividerModule, NzFormModule, NzInputModule, FormEditProfileComponent, FormChangePasswordComponent],
  templateUrl: './settings-detail-general.component.html',
  styleUrls: ['./settings-detail-general.component.scss']
})
export class SettingsDetailGeneralComponent implements OnInit {
  user$ = new Observable<User>();
  
  constructor(
    private userService: UserService,
    private userEntityService: UserEntityService,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.user$ = this.userEntityService.entities$.pipe(
      map(users => users[0])
    );
  }

  ngOnInit(): void {
  }
  
  logout() {
    this.authService.logout();
  }
  
  delete(): void {
    const id = '';
    this.userService.deleteOne(id).pipe(
      tap({
        next: () => {
          localStorage.clear();
          this.store.dispatch(logout());
          this.router.navigateByUrl(ROUTE.ROOT);
        }
      })
    ).subscribe();
  }
}
