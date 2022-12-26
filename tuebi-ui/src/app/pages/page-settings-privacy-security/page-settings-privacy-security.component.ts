import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { IconComponent } from '../../components/icon/icon.component';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../modules/auth/auth.service';
import { UserEntityService } from '../../services/user-entity.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-page-settings-privacy-security',
  standalone: true,
  imports: [CommonModule, NzModalModule, IconComponent],
  templateUrl: './page-settings-privacy-security.component.html',
  styleUrls: ['./page-settings-privacy-security.component.scss']
})
export class PageSettingsPrivacySecurityComponent {
  user$ = new Observable<User>();
  isVisible = false;
  isLoading = false;
  
  constructor(
    private userService: UserService,
    private userEntityService: UserEntityService,
    private authService: AuthService,
  ) {
    this.user$ = this.userEntityService.entities$.pipe(
      map(users => users[0])
    );
  }
  
  async delete() {
    this.isLoading = true;
    const user = await firstValueFrom(this.user$);
    this.userService.deleteOne(user.id).pipe(
      tap({
        next: () => {
          this.isLoading = false;
          this.authService.logout();
        }
      })
    ).subscribe();
  }
  
  toggleModal(bool: boolean) {
    this.isVisible = bool;
  }
}
