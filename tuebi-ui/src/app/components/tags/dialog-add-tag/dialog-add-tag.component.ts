import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Tag } from '../../../interfaces/tag.interface';
import { TagEntityService } from '../../../services/tag-entity.service';
import { AddBookmark } from '../../bookmarks/add-bookmark/add-bookmark';

@Component({
  selector: 'app-dialog-add-tag',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './dialog-add-tag.component.html',
  styleUrls: ['./dialog-add-tag.component.scss']
})
export class DialogAddTagComponent {
  form: ReturnType<typeof this.initForm>;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddBookmark>,
    private tagEntityService: TagEntityService,
  ) {
    this.form = this.initForm();
  }
  
  initForm() {
    return this.fb.group({
      tag_name: ['', [Validators.required]],
    });
  }
  
  submit() {
    this.form.patchValue({
      tag_name: this.form.controls.tag_name.value?.trim(),
    });
    
    if (this.form.valid) {
      this.tagEntityService.add(<Tag>this.form.value);
      this.dialogRef.close();
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}
