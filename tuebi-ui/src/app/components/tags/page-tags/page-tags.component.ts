import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { map, Observable, of } from 'rxjs';
import { FormAddTag } from '../form-add-tag/form-add-tag';
import { FormEditTag } from '../form-edit-tag/form-edit-tag';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Tag } from '../../../interfaces/tag.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { TagEntityService } from '../../../services/tag-entity.service';
import { COLOR_MAPPING } from '../../../enums/color-mapping.enum';
import * as _ from 'lodash';

@Component({
  selector: 'app-page-tags',
  standalone: true,
  imports: [CommonModule, FormAddTag, NzTagModule, NzDropDownModule, NzIconModule, FormEditTag],
  templateUrl: './page-tags.component.html',
  styleUrls: ['./page-tags.component.scss']
})
export class PageTagsComponent {
  tags$: Observable<Tag[]> = of([]);
  bookmarks$: Observable<Bookmark[]> = of([]);
  
  colorMapping = COLOR_MAPPING;
  
  constructor(
    private bookmarkEntityService: BookmarkEntityService,
    private tagEntityService: TagEntityService,
  ) {
    this.bookmarks$ = this.bookmarkEntityService.entities$;
    this.tags$ = this.tagEntityService.entities$;
  }
  
  deleteTag(id: string) {
    this.tagEntityService.delete(id);
    this.bookmarks$
      .pipe(map(bookmarks => {
        const affectedBookmarks = bookmarks.filter(bookmark => bookmark.bookmark_tags?.includes(id));
        if(affectedBookmarks.length) {
          affectedBookmarks.forEach((bookmark) => {
            const newTags = bookmark.bookmark_tags.filter(tagId => tagId !== id);
            this.bookmarkEntityService.update({
              id: bookmark.id,
              bookmark_tags: newTags
            });
          })
        }
      }))
      .subscribe();
  }
  
  mapColor(color: string) {
    if(_.has(this.colorMapping, color)) {
      return this.colorMapping[color].tc
    } else {
      return '#000000'
    }
  }
  
  getBookmarkNumberByTag(id: string): Observable<number> {
    return this.bookmarks$
      .pipe(map(bookmarks => bookmarks.filter(bookmark => bookmark.bookmark_tags ? bookmark.bookmark_tags.includes(id) : false)))
      .pipe(map(bookmarks => bookmarks.length))
  }
  
}
