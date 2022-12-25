import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Category } from '../../interfaces/category.interface';
import { BookmarkEntityService } from '../../services/bookmark-entity.service';
import { CategoryEntityService } from '../../services/category-entity.service';
import { IconComponent } from '../icon/icon.component';

@Component({
	standalone: true,
	selector: 'app-form-add-bookmark',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NzModalModule,
		NzFormModule,
		NzInputModule,
		NzSelectModule,
		IconComponent,
	],
	templateUrl: './form-add-bookmark.html',
	styleUrls: ['./form-add-bookmark.scss']
})
export class FormAddBookmark implements OnInit {
	categories$ = new Observable<Category[]>();
	
	form: FormGroup;
	
	selectedCategoryId = '';
	selectedCategoryName = '';
	
	isVisible = false;
	
	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private bookmarkEntityService: BookmarkEntityService,
		private categoryEntityService: CategoryEntityService
	) {
		this.categories$ = this.categoryEntityService.entities$;
		
		this.form = this.fb.group({
			bookmark_name: ['', [Validators.required]],
			bookmark_url: ['', [Validators.required]],
			category_id: ['']
		});
	}
	
	public async ngOnInit() {
		const categories = await firstValueFrom(this.categories$);
		
		this.route.paramMap.pipe(
			map((params: ParamMap) => params.get('id') || ''),
			map((id: string) => categories.find((category) => category.id === id)),
			map((category) => {
				if(category) {
					this.selectedCategoryId = category.id;
					this.selectedCategoryName = category.category_name;
				}
			})
		).subscribe();
	}
	
	get name() {
		return this.form.controls['bookmark_name'];
	}
	
	get url() {
		return this.form.controls['bookmark_url'];
	}
	
	submit() {
		this.form.patchValue({
			bookmark_name: this.name.value.trim(),
			bookmark_url: this.url.value.trim()
		});
		
		if (this.form.valid) {
			this.bookmarkEntityService.add(this.form.value);
			this.closeModal();
		}
		
	}
	
	closeModal() {
		this.isVisible = false;
	}
	
	openModal() {
		this.form.reset();
		this.form.markAsUntouched();
		this.form.markAsPristine();
		this.isVisible = true;
	}
}