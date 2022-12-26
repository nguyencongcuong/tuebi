import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../modules/auth/auth.service';
import { AppState } from '../../reducers';
import { UserEntityService } from '../../services/user-entity.service';
import { UserService } from '../../services/user.service';
import { FormChangePasswordComponent } from '../../components/form-change-password/form-change-password.component';
import { FormEditProfileComponent } from '../../components/form-edit-profile/form-edit-profile.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-settings-detail-general',
  standalone: true,
  imports: [
    CommonModule,
    NzAvatarModule,
    NzDividerModule,
    NzFormModule,
    NzInputModule,
    FormEditProfileComponent,
    FormChangePasswordComponent,
    IconComponent,
    NzModalModule,
  ],
  templateUrl: './page-settings-general.component.html',
  styleUrls: ['./page-settings-general.component.scss']
})
export class PageSettingsGeneralComponent {
  user$ = new Observable<User>();
  
  constructor(
    private userService: UserService,
    private userEntityService: UserEntityService,
    private authService: AuthService,
  ) {
    this.user$ = this.userEntityService.entities$.pipe(
      map(users => users[0])
    );
  }
  
  logout() {
    this.authService.logout();
  }
}
