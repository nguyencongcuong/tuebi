import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { THEME } from 'src/app/contansts/theme';
import { Category } from 'src/app/modules/categories/categories.model';
import { NzZorroModule } from 'src/app/nz-zorro.module';
import { CategoriesEntityService } from 'src/app/services/categories-entity.service';

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, NzZorroModule, NgIconComponent],
	selector: 'app-form-edit-category',
	templateUrl: './form-edit-category.component.html',
	styleUrls: ['./form-edit-category.component.scss']
})
export class FormEditCategoryComponent implements OnInit, OnChanges {
	@Input() category = {} as Category;
	
	form: FormGroup;
	isVisible = false;
	themes: any;
	
	constructor(
		private fb: FormBuilder,
		private categoryEntityService: CategoriesEntityService
	) {
		this.form = this.fb.group({
			id: [this.category.id, [Validators.required]],
			category_name: [this.category.category_name, [Validators.required]],
			category_theme: [this.category.category_theme]
		});
	}
	
	get name() {
		return this.form.controls['category_name'].value;
	}
	
	get theme() {
		return this.form.controls['category_theme'].value;
	}
	
	ngOnInit(): void {
		this.themes = Object.entries(THEME.COLOR);
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['category'].firstChange) {
			this.form.patchValue({
				id: changes['category'].currentValue.id,
				category_name: changes['category'].currentValue.category_name,
				category_theme: changes['category'].currentValue.category_theme
			});
		}
	}
	
	submit() {
		console.log(this.form.value);
		this.categoryEntityService.update(this.form.value);
		this.closeModal();
	}
	
	closeModal() {
		this.isVisible = false;
	}
	
	openModal() {
		this.isVisible = true;
	}
	
	changeColor(theme: any) {
		this.form.patchValue({
			category_theme: theme[1]
		});
	}
	
}
