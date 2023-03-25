import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { firstValueFrom, map, Observable } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { UserEntityService } from '../../../services/user-entity.service';
import { UserService } from '../../../services/user.service';
import { IconComponent } from '../../commons/icon/icon.component';
import { SettingAppearanceComponent } from '../setting-appearance/setting-appearance.component';

@Component({
  selector: 'app-setting-appearance-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    IconComponent, 
    MatIconModule, 
    MatMenuModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatSlideToggleModule
  ],
  templateUrl: './setting-appearance-dialog.component.html',
  styleUrls: ['./setting-appearance-dialog.component.scss']
})
export class SettingAppearanceDialogComponent {
  user$ : Observable<User>;
  
  constructor(
    public dialogRef: MatDialogRef<SettingAppearanceComponent>,
    private userService: UserService,
    private userEntityService: UserEntityService,
  ) {
    this.user$ = this.userEntityService.entities$.pipe(map(users => users[0]));
  }
  
  async toggleFavicon() {
    const user = await firstValueFrom(this.user$);
    this.userEntityService.update({
      id: user.id,
      user_settings: {
        ...user.user_settings,
        is_favicon_shown: !user.user_settings.is_favicon_shown
      }
    })
  }
  
  async toggleBookmarkCount() {
    const user = await firstValueFrom(this.user$);
    this.userEntityService.update({
      id: user.id,
      user_settings: {
        ...user.user_settings,
        is_bookmark_count_shown: !user.user_settings.is_bookmark_count_shown
      }
    })
  }
  
  close() {
    this.dialogRef.close();
  }
  
}
