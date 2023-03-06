import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { IconComponent } from '../../icon/icon.component';
import { User } from '../../../interfaces/user.interface';
import { UserEntityService } from '../../../services/user-entity.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-setting-privacy-security',
  standalone: true,
  imports: [CommonModule, NzModalModule, IconComponent, NzSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './setting-privacy-security.component.html',
  styleUrls: ['./setting-privacy-security.component.scss']
})
export class SettingPrivacySecurityComponent {
  user$ = new Observable<User>();
  isVisible = false;
  isDeleteModalVisible = false;
  isLoading = false;
  
  // Schedule Deletion
  scheduleTimeToDelete: 3 | 6 | 9 | 12 = 3;
  isScheduleDeletionVisible = false;
  
  constructor(
    private userService: UserService,
    private userEntityService: UserEntityService,
    private msalService: MsalService,
  ) {
    this.user$ = this.userEntityService.entities$.pipe(
      map(users => users[0])
    );
    
    this.user$.subscribe(user => {
      this.scheduleTimeToDelete = user.user_settings.user_month_to_delete;
    })
  }
  
  // Immediate Deletion
  async delete() {
    this.isLoading = true;
    const user = await firstValueFrom(this.user$);
    this.userService.deleteOne(user.id).pipe(
      tap({
        next: () => {
          this.isLoading = false;
          this.msalService.logout();
        }
      })
    ).subscribe();
  }
  
  openModal() {
    this.isVisible = true;
  }
  
  closeModal() {
    this.isVisible = false;
  }
  
  openDeleteModal() {
    this.isDeleteModalVisible = true;
  }
  
  closeDeleteModal() {
    this.isDeleteModalVisible = false;
  }
  
  // Schedule Deletion
  async updateScheduleDeletionTime() {
    const user = await firstValueFrom(this.user$);
    this.userEntityService.update({
      id: user.id,
      user_settings: {
        ...user.user_settings,
        user_month_to_delete: this.scheduleTimeToDelete
      }
    })
    await this.toggleScheduleDeletionModal(false);
  }
  
  async toggleScheduleDeletionModal(bool: boolean) {
    const user = await firstValueFrom(this.user$)
    this.isScheduleDeletionVisible = bool;
    this.scheduleTimeToDelete = user.user_settings.user_month_to_delete;
  }
}
