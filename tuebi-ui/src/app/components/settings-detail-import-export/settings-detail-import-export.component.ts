import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { BookmarksEntityService } from 'src/app/modules/categories/services/bookmarks-entity.service';
import { CategoriesEntityService } from 'src/app/modules/categories/services/categories-entity.service';
import { UserService } from 'src/app/modules/categories/services/user.service';
import { NgIconModule } from 'src/app/ng-icon.module';
import { environment } from 'src/environments/environment';

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, NzUploadModule, NzSpinModule, NzButtonModule, NgIconModule],
	selector: 'app-settings-detail-import-export',
	templateUrl: './settings-detail-import-export.component.html',
	styleUrls: ['./settings-detail-import-export.component.scss']
})
export class SettingsDetailImportExportComponent implements OnInit {
	isImportingBookmarkLoading: boolean = false;
	form: FormGroup;
	BROWSER: 'Chrome' | 'Firefox' = 'Chrome';
	acceptFile = '.html'; // Chrome Bookmark Exported File
	
	authorization = '';
	
	UPLOAD_API_URL = environment.backend_url + '/bookmarks/import';
	
	constructor(
		private fb: FormBuilder,
		private msg: NzMessageService,
		private userService: UserService,
		private categoriesEntityService: CategoriesEntityService,
		private bookmarksEntityService: BookmarksEntityService
	) {
		this.form = this.fb.group({
			browser_name: [this.BROWSER, [Validators.required]]
		});
	}
	
	ngOnInit(): void {
		this.authorization = 'Bearer ' + this.userService.getAuthedUser().access_token;
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
				this.categoriesEntityService.getAll();
				this.bookmarksEntityService.getAll();
			}
		} else if (info.file.status === 'error') {
			this.msg.error(`${info.file.name} file import failed.`);
		}
	}
}
