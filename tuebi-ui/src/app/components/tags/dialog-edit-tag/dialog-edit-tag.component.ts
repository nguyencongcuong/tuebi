import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { COLOR_MAPPING } from '../../../enums/color-mapping.enum';
import { Tag } from '../../../interfaces/tag.interface';
import { TagEntityService } from '../../../services/tag-entity.service';
import { EditTagComponent } from '../edit-tag/edit-tag.component';

@Component({
  selector: 'app-dialog-edit-category',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './dialog-edit-tag.component.html',
  styleUrls: ['./dialog-edit-tag.component.scss']
})
export class DialogEditTagComponent {
  form: ReturnType<typeof this.initForm>;
  colorMapping = COLOR_MAPPING;
  colors = Object.keys(COLOR_MAPPING);
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tag,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTagComponent>,
    private tagEntityService: TagEntityService,
  ) {
    this.form = this.initForm();
  }
  
  initForm() {
    return this.fb.group({
      id: [this.data.id || '', [Validators.required]],
      tag_name: [this.data.tag_name, [Validators.required]],
      tag_color: [this.data.tag_color]
    });
  }
  
  submit() {
    this.form.patchValue({
      tag_name: this.form.controls.tag_name.value?.trim(),
    });
    
    if (this.form.valid) {
      this.tagEntityService.update(<Tag>this.form.value);
      this.dialogRef.close();
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}
