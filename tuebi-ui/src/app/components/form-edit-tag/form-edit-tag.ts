import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { COLOR_MAPPING } from '../../enums/color-mapping.enum';
import { Tag } from '../../interfaces/tag.interface';
import { TagEntityService } from '../../services/tag-entity.service';
import { IconComponent } from '../icon/icon.component';

@Component({
	standalone: true,
	selector: 'app-form-edit-tag',
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
		NzIconModule,
		NzRadioModule,
	],
	templateUrl: './form-edit-tag.html',
	styleUrls: ['./form-edit-tag.scss']
})
export class FormEditTag implements OnChanges {
	@Input() tag: Partial<Tag> = {
		id: '',
		tag_name: '',
		tag_color: '',
	}
	
	form: FormGroup;
	isVisible = false;
	colorMapping = COLOR_MAPPING;
	colors = Object.keys(this.colorMapping);
	
	selectedColor = '';
	
	constructor(
		private fb: FormBuilder,
		private tagEntityService: TagEntityService,
	) {
		this.form = this.fb.group({
			id: [this.tag.id, [Validators.required]],
			tag_name: [this.tag.tag_name, [Validators.required]],
			tag_color: [this.tag.tag_color]
		});
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['tag'].firstChange) {
			const { id, tag_name, tag_color  } = changes['tag'].currentValue;
			this.form.patchValue({
				id: id,
				tag_name: tag_name,
				tag_color: tag_color,
			});
		}
	}
	
	submit() {
		if (this.form.valid) {
			this.tagEntityService.update(this.form.value);
			this.closeModal();
		}
	}
	
	closeModal() {
		this.isVisible = false;
	}
	
	openModal() {
		this.isVisible = true;
	}
	
	selectColor(color: string) {
		this.form.patchValue({
			tag_color: color
		})
		this.selectedColor = color;
	}
}