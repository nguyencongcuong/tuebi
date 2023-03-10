import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AuthService } from '../../../services/auth.service';
import { AvatarComponent } from '../../avatar/avatar.component';
import { IconComponent } from '../../icon/icon.component';
import { SettingAppearanceComponent } from '../setting-appearance/setting-appearance.component';
import { SettingImportComponent } from '../setting-import/setting-import.component';
import { SettingPrivacySecurityComponent } from '../setting-privacy-security/setting-privacy-security.component';

@Component({
  selector: 'app-setting-list',
  standalone: true,
  imports: [CommonModule, NzAvatarModule, IconComponent, NzDropDownModule, NzDividerModule, SettingAppearanceComponent, SettingPrivacySecurityComponent, SettingImportComponent, AvatarComponent, NzButtonModule],
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss']
})
export class SettingListComponent {
  constructor(
    private authService: AuthService
  ) {}
  
  logout() {
    this.authService.logout();
  }
}
