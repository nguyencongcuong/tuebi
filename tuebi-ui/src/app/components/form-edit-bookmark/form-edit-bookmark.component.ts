import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Observable } from 'rxjs';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { Category } from 'src/app/modules/categories/categories.model';
import { BookmarksEntityService } from 'src/app/modules/categories/services/bookmarks-entity.service';
import { CategoriesEntityService } from 'src/app/modules/categories/services/categories-entity.service';

@Component({
	standalone: true,
	selector: 'app-form-edit-bookmark',
	imports: [CommonModule, ReactiveFormsModule, FormsModule, NzFormModule, NzModalModule, NzInputModule, NzSelectModule, NzIconModule],
	templateUrl: './form-edit-bookmark.component.html',
	styleUrls: ['./form-edit-bookmark.component.scss']
})
export class FormEditBookmarkComponent implements OnChanges {
	
	@Input() bookmark = {} as Bookmark;
	
	categories$ = new Observable<Category[]>();
	
	form: FormGroup;
	isVisible = false;
	themes: any;
	
	constructor(
		private fb: FormBuilder,
		private bookmarkEntityService: BookmarksEntityService,
		private categoryEntityService: CategoriesEntityService
	) {
		this.categories$ = this.categoryEntityService.entities$;
		
		this.form = this.fb.group({
			id: [this.bookmark.id, [Validators.required]],
			bookmark_name: [this.bookmark.bookmark_name, [Validators.required]],
			bookmark_url: [this.bookmark.bookmark_url, [Validators.required]],
			category_id: [this.bookmark.category_id, [Validators.required]]
		});
	}
	
	get name() {
		return this.form.controls['bookmark_name'].value;
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['bookmark'].firstChange) {
			this.form.patchValue({
				id: changes['bookmark'].currentValue.id,
				bookmark_name: changes['bookmark'].currentValue.bookmark_name,
				bookmark_url: changes['bookmark'].currentValue.bookmark_url,
				category_id: changes['bookmark'].currentValue.category_id
			});
		}
	}
	
	submit() {
		this.bookmarkEntityService.update(this.form.value);
		this.closeModal();
	}
	
	closeModal() {
		this.isVisible = false;
	}
	
	openModal() {
		this.isVisible = true;
	}
	
}
