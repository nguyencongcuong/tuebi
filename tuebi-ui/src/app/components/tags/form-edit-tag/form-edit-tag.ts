import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { debounceTime, map, Observable, of } from 'rxjs';
import { COLOR_MAPPING } from '../../../enums/color-mapping.enum';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Tag } from '../../../interfaces/tag.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { TagEntityService } from '../../../services/tag-entity.service';
import { IconComponent } from '../../icon/icon.component';

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
export class FormEditTag implements OnInit, OnChanges {
	@Input() tag: Partial<Tag> = {
		id: '',
		tag_name: '',
		tag_color: '',
	}
	
	public form: FormGroup;
	public colorMapping = COLOR_MAPPING;
	public colors = Object.keys(this.colorMapping);
	public bookmarks$: Observable<Bookmark[]> = of([]);
	
	constructor(
		private fb: FormBuilder,
		private tagEntityService: TagEntityService,
		private bookmarkEntityService: BookmarkEntityService,
	) {
		this.bookmarks$ = this.bookmarkEntityService.entities$;
		
		this.form = this.fb.group({
			id: [this.tag.id, [Validators.required]],
			tag_name: [this.tag.tag_name, [Validators.required]],
			tag_color: [this.tag.tag_color]
		});
	}
	
	public ngOnInit() {
		this.form.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
			this.submit();
		})
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
		}
	}
	
	delete() {
		if(this.tag.id) {
			this.tagEntityService.delete(this.tag.id);
			this.bookmarks$
				.pipe(map(bookmarks => {
					const affectedBookmarks = bookmarks.filter(bookmark => bookmark.bookmark_tags?.includes(this.tag.id || ''));
					if(affectedBookmarks.length) {
						affectedBookmarks.forEach((bookmark) => {
							const newTags = bookmark.bookmark_tags.filter(tagId => tagId !== this.tag.id);
							this.bookmarkEntityService.update({
								id: bookmark.id,
								bookmark_tags: newTags
							});
						})
					}
				}))
				.subscribe();
		}
	}
}