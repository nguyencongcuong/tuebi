import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Observable } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Category } from '../../../interfaces/category.interface';
import { Tag } from '../../../interfaces/tag.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { CategoriesEntityService } from '../../../modules/categories/categories.entity.service';
import { TagEntityService } from '../../../services/tag-entity.service';
import { IconComponent } from '../../commons/icon/icon.component';
import { DialogEditBookmarkComponent } from '../dialog-edit-bookmark/dialog-edit-bookmark.component';

@Component({
	standalone: true,
	selector: 'app-edit-bookmark',
	imports: [CommonModule, ReactiveFormsModule, FormsModule, NzFormModule, NzModalModule, NzInputModule, NzSelectModule, NzIconModule, IconComponent, NzMenuModule],
	templateUrl: './edit-bookmark.component.html',
	styleUrls: ['./edit-bookmark.component.scss']
})
export class EditBookmarkComponent implements OnChanges {
	@Input() bookmark = {} as Bookmark;
	
	categories$ = new Observable<Category[]>();
	tags$ = new Observable<Tag[]>();
	
	form: FormGroup;
	
	constructor(
		private fb: FormBuilder,
		private bookmarkEntityService: BookmarkEntityService,
		private categoryEntityService: CategoriesEntityService,
		private tagEntityService: TagEntityService,
		public dialog: MatDialog,
	) {
		this.categories$ = this.categoryEntityService.entities$;
		this.tags$ = this.tagEntityService.entities$;
		
		this.form = this.fb.group({
			id: [this.bookmark.id, [Validators.required]],
			bookmark_name: [this.bookmark.bookmark_name, [Validators.required]],
			bookmark_url: [this.bookmark.bookmark_url, [Validators.required]],
			category_id: [this.bookmark.category_id, [Validators.required]],
			bookmark_tags: [this.bookmark.bookmark_tags, ]
		});
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['bookmark'].firstChange) {
			const { id, bookmark_name, bookmark_url, category_id, bookmark_tags  } = changes['bookmark'].currentValue;
			this.form.patchValue({
				id: id,
				bookmark_name: bookmark_name,
				bookmark_url: bookmark_url,
				category_id: category_id,
				bookmark_tags: bookmark_tags,
			});
		}
	}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(DialogEditBookmarkComponent, { data: this.bookmark });
		dialogRef.afterClosed().subscribe()
	}
	
}
