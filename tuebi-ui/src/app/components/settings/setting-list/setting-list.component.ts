import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';
import { AvatarComponent } from '../../avatar/avatar.component';
import { SettingAppearanceComponent } from '../setting-appearance/setting-appearance.component';
import { SettingImportComponent } from '../setting-import/setting-import.component';
import { SettingPrivacySecurityComponent } from '../setting-privacy-security/setting-privacy-security.component';

@Component({
  selector: 'app-setting-list',
  standalone: true,
  imports: [
    CommonModule, 
    SettingAppearanceComponent, 
    SettingPrivacySecurityComponent, 
    SettingImportComponent, 
    AvatarComponent, 
    MatMenuModule, 
    MatDividerModule, 
    MatButtonModule,
    MatIconModule
  ],
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
