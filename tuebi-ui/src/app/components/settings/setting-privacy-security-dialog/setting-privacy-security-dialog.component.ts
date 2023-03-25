import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MsalService } from '@azure/msal-angular';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { delay, firstValueFrom, map, Observable, tap } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { UserEntityService } from '../../../services/user-entity.service';
import { UserService } from '../../../services/user.service';
import { IconComponent } from '../../commons/icon/icon.component';
import { SettingPrivacySecurityComponent } from '../setting-privacy-security/setting-privacy-security.component';

@Component({
  selector: 'app-setting-privacy-security-dialog',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    IconComponent,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './setting-privacy-security-dialog.component.html',
  styleUrls: ['./setting-privacy-security-dialog.component.scss']
})
export class SettingPrivacySecurityDialogComponent {
  public user$ = new Observable<User>();
  public isDeleting: boolean = false;
  public scheduleTimeToDelete: 3 | 6 | 9 | 12 | undefined = 3;
  public confirmedUserId = '';
  
  constructor(
    private userService: UserService,
    private userEntityService: UserEntityService,
    private msalService: MsalService,
    public dialogRef: MatDialogRef<SettingPrivacySecurityComponent>,
    private snackBar: MatSnackBar,
  ) {
    this.user$ = this.userEntityService.entities$.pipe(map(users => users[0]));
    this.user$.subscribe(user => {
      this.scheduleTimeToDelete = user.user_settings.user_month_to_delete;
    });
  }
  
  // Immediate Deletion
  async delete() {
    this.isDeleting = true;
  
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
  
    this.snackBar.open('Your data is being deleted', undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    
    const user = await firstValueFrom(this.user$);
    
    this.userService.deleteOne(user.id).pipe(
      delay(2000),
      tap({
        next: () => {
          this.snackBar.open(`Your account has been successfully deleted. We're sorry to see you go. If you have any feedback on how we can improve our service, please don't hesitate to let us know. Thank you for being a part of our community.`, undefined, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      }),
      delay(5000),
      tap(() => {
        this.snackBar.dismiss();
        this.dialogRef.close();
        this.msalService.logout();
      })
    ).subscribe();
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
    });
  }
  
  close() {
    this.dialogRef.close();
  }
}
