import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TagEntityService } from '../../services/tag-entity.service';
import { IconComponent } from '../icon/icon.component';

@Component({
	standalone: true,
	selector: 'app-form-add-tag',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NzModalModule,
		NzFormModule,
		NzInputModule,
		NzSelectModule,
		IconComponent,
		NzButtonModule,
	],
	templateUrl: './form-add-tag.html',
	styleUrls: ['./form-add-tag.scss']
})
export class FormAddTag implements OnInit {
	form: FormGroup;
	isVisible = false;
	
	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private tagEntityService: TagEntityService,
	) {
		this.form = this.fb.group({
			tag_name: ['', [Validators.required]],
		});
	}
	
	public async ngOnInit() {
	}
	
	get name() {
		return this.form.controls['tag_name'];
	}
	
	submit() {
		this.form.patchValue({
			tag_name: this.name.value.trim(),
		});
		
		if (this.form.valid) {
			this.tagEntityService.add(this.form.value);
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