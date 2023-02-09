import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { IconComponent } from '../../components/icon/icon.component';
import { User } from '../../interfaces/user.interface';
import { UserEntityService } from '../../services/user-entity.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-page-settings-privacy-security',
  standalone: true,
  imports: [CommonModule, NzModalModule, IconComponent, NzSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './page-settings-privacy-security.component.html',
  styleUrls: ['./page-settings-privacy-security.component.scss']
})
export class PageSettingsPrivacySecurityComponent {
  user$ = new Observable<User>();
  isVisible = false;
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
  
  toggleModal(bool: boolean) {
    this.isVisible = bool;
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
