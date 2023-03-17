import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Category } from '../../../interfaces/category.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { CategoryEntityService } from '../../../services/category-entity.service';
import { AddBookmark } from '../add-bookmark/add-bookmark';

@Component({
  selector: 'app-dialog-edit-bookmark',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './dialog-edit-bookmark.component.html',
  styleUrls: ['./dialog-edit-bookmark.component.scss']
})
export class DialogEditBookmarkComponent {
  form: ReturnType<typeof this.initForm>;
  categories$ : Observable<Category[]> = of([])
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Bookmark,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddBookmark>,
    private bookmarkEntityService: BookmarkEntityService,
    private categoryEntityService: CategoryEntityService,
  ) {
    this.form = this.initForm();
    this.categories$ = this.categoryEntityService.entities$;
  }
  
  initForm() {
    return this.fb.group({
      id:[ this.data.id || '', [Validators.required]],
      bookmark_name: [this.data.bookmark_name, [Validators.required]],
      bookmark_url: [this.data.bookmark_url, [Validators.required]],
      category_id: [this.data.category_id || '']
    });
  }
  
  submit() {
    this.form.patchValue({
      bookmark_name: this.form.controls.bookmark_name.value?.trim(),
      bookmark_url: this.form.controls.bookmark_url.value?.trim(),
      category_id: this.form.controls.category_id.value?.trim()
    });
    
    if (this.form.valid) {
      this.bookmarkEntityService.update(<Bookmark>this.form.value);
      this.dialogRef.close();
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}
