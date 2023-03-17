import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Category } from '../../../interfaces/category.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { CategoryEntityService } from '../../../services/category-entity.service';
import { AddBookmark } from '../add-bookmark/add-bookmark';

@Component({
  selector: 'app-dialog-add-bookmark',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './dialog-add-bookmark.component.html',
  styleUrls: ['./dialog-add-bookmark.component.scss']
})
export class DialogAddBookmarkComponent {
  form: ReturnType<typeof this.initForm>;
  categories$ : Observable<Category[]> = of([])
  
  constructor(
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
      bookmark_name: ['', [Validators.required]],
      bookmark_url: ['', [Validators.required]],
      category_id: ['']
    });
  }
  
  submit() {
    this.form.patchValue({
      bookmark_name: this.form.controls.bookmark_name.value?.trim(),
      bookmark_url: this.form.controls.bookmark_url.value?.trim(),
      category_id: this.form.controls.category_id.value?.trim()
    });
    
    if (this.form.valid) {
      this.bookmarkEntityService.add(<Bookmark>this.form.value);
      this.dialogRef.close();
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}
