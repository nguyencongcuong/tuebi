import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Observable, of } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Category } from '../../../interfaces/category.interface';
import { Tag } from '../../../interfaces/tag.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { BookmarkService } from '../../../services/bookmark.service';
import { CategoryEntityService } from '../../../services/category-entity.service';
import { IconComponent } from '../../icon/icon.component';
import { BookmarkComponent } from '../bookmark/bookmark.component';

@Component({
  selector: 'app-multiple-select',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    BookmarkComponent,
    CdkDrag,
    DragDropModule,
    IconComponent,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './bookmark-list-select-container.component.html',
  styleUrls: ['./bookmark-list-select-container.component.scss'],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: {clickAction: 'check', color: 'accent'} as MatCheckboxDefaultOptions,
    }
  ]
})
export class BookmarkListSelectContainerComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  
  @Input() bookmarks: Bookmark[] | null = null;
  @Input() tags: Tag[] | null = null;
  @Input() options = {
    route_params_id: ''
  };
  
  public categories$: Observable<Category[]> = of([]);
  public allTagsSelected: boolean = false;
  public isAllBookmarksSelected: boolean = false;
  public isSomeBookmarksSelected: boolean = false;
  
  constructor(
    private bookmarkEntityService: BookmarkEntityService,
    private bookmarkService: BookmarkService,
    private categoryEntityService: CategoryEntityService,
  ) {
    this.categories$ = this.categoryEntityService.entities$;
  }
  
  public ngOnInit() {
    if (this.bookmarks && this.bookmarks.length) {
      this.bookmarks.forEach(item => item.is_selected = false);
    }
  }
  
  // Bookmark
  isAllBookmarkSelected() {
    this.isAllBookmarksSelected = this.bookmarks !== null && this.bookmarks.every(item => item.is_selected);
  }
  
  selectSomeBookmarks(): boolean {
    if (this.bookmarks) {
      this.isSomeBookmarksSelected = this.bookmarks?.filter(b => b.is_selected).length > 0 && !this.isAllBookmarksSelected;
      return this.isSomeBookmarksSelected;
    } else {
      return false;
    }
  }
  
  setAllBookmarkSelection(selected: boolean) {
    this.isAllBookmarksSelected = selected;
    if (!this.isAllBookmarksSelected) {
      this.bookmarks?.forEach(item => item.is_selected = false);
    } else {
      this.bookmarks?.forEach(item => item.is_selected = true);
    }
  }
  
  isAllTagSelected() {
    this.allTagsSelected = this.tags != null && this.tags.every(t => t.is_selected);
  }
  
  selectSomeTags(): boolean {
    if (this.tags === null) {
      return false;
    }
    return this.tags.filter(t => t.is_selected).length > 0 && !this.allTagsSelected;
  }
  
  setAllTagSelection(selected: boolean) {
    this.allTagsSelected = selected;
    if (this.tags === null) {
      return;
    }
    this.tags.forEach(t => (t.is_selected = selected));
  }
  
  onMenuItemClick(event: MouseEvent) {
    // do something when menu item is clicked
    event.stopPropagation(); // prevent menu from closing
  }
  
  removeSelectedBookmarks() {
    if (this.bookmarks) {
      for (const bookmark of this.bookmarks) {
        if (bookmark.is_selected) {
          this.bookmarkEntityService.update({
            id: bookmark.id,
            bookmark_deleted: true
          });
        }
      }
    }
  }
  
  deleteSelectedBookmarks() {
    if (this.bookmarks) {
      for (const bookmark of this.bookmarks) {
        if (bookmark.is_selected) {
          this.bookmarkEntityService.delete(bookmark.id);
        }
      }
    }
  }
  
  restoreSelectedBookmarks() {
    if (this.bookmarks) {
      for (const bookmark of this.bookmarks) {
        if (bookmark.is_selected) {
          this.bookmarkEntityService.update({
            id: bookmark.id,
            bookmark_deleted: false
          });
        }
      }
    }
  }
  
  openSelectedBookmarks() {
    if (this.bookmarks) {
      for (const bookmark of this.bookmarks) {
        if (bookmark.is_selected) {
          this.bookmarkService.open(bookmark.bookmark_url);
        }
      }
    }
  }
  
  copySelectedBookmarkUrls() {
    if (this.bookmarks) {
      const bookmarkUrls = this.bookmarks
        .filter(bookmark => bookmark.is_selected)
        .map(bookmark => bookmark.bookmark_url);
      this.bookmarkService.copy(bookmarkUrls);
    }
  }
  
  setSelectedBookmarkCategory(categoryId: string) {
    if (this.bookmarks) {
      for (const bookmark of this.bookmarks) {
        if (bookmark.is_selected) {
          this.bookmarkEntityService.update({
            id: bookmark.id,
            category_id: categoryId
          });
        }
      }
    }
  }
  
  setSelectedBookmarkTag() {
    this.menuTrigger.closeMenu();
    
    const selectedTags = this.tags?.filter(tag => tag.is_selected);
    const selectedTagIds = selectedTags?.map(tag => tag.id);
    
    if (this.bookmarks) {
      for (const bookmark of this.bookmarks) {
        if (bookmark.is_selected) {
          this.bookmarkEntityService.update({
            id: bookmark.id,
            bookmark_tags: selectedTagIds
          });
        }
      }
    }
  }
  
  async dropBookmark(event: CdkDragDrop<string[]>) {
    if (this.bookmarks) {
      moveItemInArray(this.bookmarks, event.previousIndex, event.currentIndex);
      const newList = this.bookmarks.map((bookmark, i) => ({id: bookmark.id, bookmark_order: i}));
      for (const bookmark of newList) {
        this.bookmarkEntityService.update(bookmark);
      }
    }
  }
}
