import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../interfaces/category.interface';
import { CategoriesEntityService } from '../../../modules/categories/categories.entity.service';
import { EditCategoryComponent } from '../edit-category/edit-category.component';

@Component({
  selector: 'app-dialog-edit-category',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './dialog-edit-category.component.html',
  styleUrls: ['./dialog-edit-category.component.scss']
})
export class DialogEditCategoryComponent {
  form: ReturnType<typeof this.initForm>;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditCategoryComponent>,
    private categoryEntityService: CategoriesEntityService,
  ) {
    this.form = this.initForm();
  }
  
  initForm() {
    return this.fb.group({
      id:[ this.data.id || '', [Validators.required]],
      category_name: [this.data.category_name, [Validators.required]],
    });
  }
  
  submit() {
    this.form.patchValue({
      category_name: this.form.controls.category_name.value?.trim(),
    });
    
    if (this.form.valid) {
      this.categoryEntityService.update(<Category>this.form.value);
      this.dialogRef.close();
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}
