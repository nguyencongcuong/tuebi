import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { THEME } from 'src/app/contansts/theme';
import { NgIconModule } from 'src/app/ng-icon.module';
import { NzZorroModule } from 'src/app/nz-zorro.module';
import { CategoriesEntityService } from 'src/app/services/categories-entity.service';

@Component({
		standalone: true,
		imports: [CommonModule, FormsModule, ReactiveFormsModule, NzZorroModule, NgIconModule],
		selector: 'app-form-add-category',
		templateUrl: './form-add-category.html',
		styleUrls: ['./form-add-category.scss']
	}
)
export class FormAddCategory implements OnInit {
	form: FormGroup;
	isVisible = false;
	themes: any;
	
	constructor(
		private fb: FormBuilder,
		private categoryEntityService: CategoriesEntityService
	) {
		this.form = this.fb.group({
			category_name: ['', [Validators.required]],
			category_theme: ['']
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
	
	submit() {
		this.form.patchValue({
			category_name: this.name.trim()
		});
		
		if (this.form.valid) {
			this.categoryEntityService.add(this.form.value);
			this.form.reset();
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
	
	changeColor(theme: any) {
		this.form.patchValue({
			category_theme: theme[1]
		});
	}
}
