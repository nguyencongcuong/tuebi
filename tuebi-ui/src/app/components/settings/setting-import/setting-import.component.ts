import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { environment } from '../../../../environments/environment';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { CategoryEntityService } from '../../../services/category-entity.service';
import { UserService } from '../../../services/user.service';
import { IconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzUploadModule,
    IconComponent,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  selector: 'app-setting-import',
  templateUrl: './setting-import.component.html',
  styleUrls: ['./setting-import.component.scss']
})
export class SettingImportComponent implements OnInit {
  public UPLOAD_API_URL = environment.backend_url + '/bookmarks/import';
  public authorization = '';
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private categoryEntityService: CategoryEntityService,
    private bookmarkEntityService: BookmarkEntityService,
    private snackBar: MatSnackBar
  ) {
  }
  
  ngOnInit(): void {
    this.authorization = 'Bearer ' + this.userService.getAuthedUser().accessToken;
  }
  
  handleChange(info: NzUploadChangeParam): void {
    this.snackBar.open(
      'Please wait while your bookmarks are being imported.',
      undefined,
      {verticalPosition: 'bottom'}
    );
    
    if (info.file.status !== 'uploading') {
      console.log(info.file.status);
    }
    
    if (info.file.status === 'done') {
      if (info.file.response) {
        this.snackBar.dismiss();
        this.snackBar.open(
          'Your bookmarks imported successfully.',
          undefined,
          {duration: 3000}
        );
        this.categoryEntityService.getAll();
        this.bookmarkEntityService.getAll();
      }
    } else if (info.file.status === 'error') {
      this.snackBar.dismiss();
      this.snackBar.open(`${info.file.name} file import failed.`);
    }
  }
}
