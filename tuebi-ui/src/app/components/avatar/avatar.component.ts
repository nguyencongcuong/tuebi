import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user.interface';
import { UserEntityService } from '../../services/user-entity.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, NzAvatarModule, IconComponent, NzUploadModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  public acceptFile = 'image/png, image/jpeg'; // Chrome Bookmark Exported File
  public authorization = '';
  public UPLOAD_API_URL = environment.backend_url + '/images/avatar';
  public user$ = new Observable<User>()
  
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private userEntityService: UserEntityService
  ) {
    this.user$ = this.userEntityService.entities$.pipe(map(users => users[0]));
  }
  
  ngOnInit(): void {
    const b2cPayload = JSON.parse(localStorage.getItem('b2c_payload') as string);
    this.authorization = `Bearer ${b2cPayload.accessToken}`;
  }
  
  handleChange(info: NzUploadChangeParam): void {
    const { response, name, status } = info.file;
    
    if(status === 'done') {
      if(response.success) {
        const message = 'Your avatar updated successfully!';
        this.msg.success(message, { nzDuration: 3000 });
        this.userEntityService.update(response.data);
      } 
    } else if (status === 'error') {
      this.msg.error(`Failed to upload ${name}`);
    }
  }
}
