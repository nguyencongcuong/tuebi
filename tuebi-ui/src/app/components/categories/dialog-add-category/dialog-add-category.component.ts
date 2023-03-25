import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../interfaces/category.interface';
import { CategoriesEntityService } from '../../../modules/categories/categories.entity.service';
import { AddBookmark } from '../../bookmarks/add-bookmark/add-bookmark';

@Component({
  selector: 'app-dialog-add-category',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './dialog-add-category.component.html',
  styleUrls: ['./dialog-add-category.component.scss']
})
export class DialogAddCategoryComponent {
  form: ReturnType<typeof this.initForm>;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddBookmark>,
    private categoryEntityService: CategoriesEntityService,
  ) {
    this.form = this.initForm();
  }
  
  initForm() {
    return this.fb.group({
      category_name: ['', [Validators.required]],
    });
  }
  
  submit() {
    this.form.patchValue({
      category_name: this.form.controls.category_name.value?.trim(),
    });
    
    if (this.form.valid) {
      this.categoryEntityService.add(<Category>this.form.value);
      this.dialogRef.close();
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}
