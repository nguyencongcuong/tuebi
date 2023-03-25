import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { map, Observable } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { AuthService } from '../../../services/auth.service';
import { UserEntityService } from '../../../services/user-entity.service';
import { AvatarComponent } from '../../commons/avatar/avatar.component';
import { SettingAppearanceDialogComponent } from '../setting-appearance-dialog/setting-appearance-dialog.component';
import { SettingAppearanceComponent } from '../setting-appearance/setting-appearance.component';
import { SettingImportComponent } from '../setting-import/setting-import.component';
import { SettingPrivacySecurityComponent } from '../setting-privacy-security/setting-privacy-security.component';

@Component({
  selector: 'app-setting-list',
  standalone: true,
  imports: [
    CommonModule,
    SettingAppearanceDialogComponent,
    SettingImportComponent,
    AvatarComponent,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    SettingAppearanceComponent,
    SettingPrivacySecurityComponent
  ],
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss']
})
export class SettingListComponent {
  public user$ : Observable<User>;
  
  constructor(
    private authService: AuthService,
    private userEntityService: UserEntityService
  ) {
    this.user$ = this.userEntityService.entities$.pipe(map(users => users[0]))
  }
  
  logout() {
    this.authService.logout();
  }
}
