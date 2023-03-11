import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { environment } from '../../../../environments/environment';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { CategoryEntityService } from '../../../services/category-entity.service';
import { UserService } from '../../../services/user.service';
import { IconComponent } from '../../icon/icon.component';

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, NzUploadModule, NzSpinModule, NzButtonModule, IconComponent, NzModalModule],
	selector: 'app-setting-import',
	templateUrl: './setting-import.component.html',
	styleUrls: ['./setting-import.component.scss']
})
export class SettingImportComponent implements OnInit {
	isImportingBookmarkLoading: boolean = false;
	authorization = '';
	UPLOAD_API_URL = environment.backend_url + '/bookmarks/import';
	
	public isVisible = false;
	
	constructor(
		private fb: FormBuilder,
		private msg: NzMessageService,
		private userService: UserService,
		private categoryEntityService: CategoryEntityService,
		private bookmarkEntityService: BookmarkEntityService
	) {
	}
	
	ngOnInit(): void {
		this.authorization = 'Bearer ' + this.userService.getAuthedUser().accessToken;
	}
	
	handleChange(info: NzUploadChangeParam): void {
		this.isImportingBookmarkLoading = true;
		
		if (info.file.status !== 'uploading') {
			console.log(info.file.status);
		}
		
		if (info.file.status === 'done') {
			if (info.file.response) {
				this.msg.success('Your bookmarks imported successfully!', {
					nzDuration: 3000
				});
				this.isImportingBookmarkLoading = false;
				this.categoryEntityService.getAll();
				this.bookmarkEntityService.getAll();
			}
		} else if (info.file.status === 'error') {
			this.msg.error(`${info.file.name} file import failed.`);
		}
	}
	
	openModal() {
		this.isVisible = true;
	}
	
	closeModal() {
		this.isVisible = false;
	}
}
