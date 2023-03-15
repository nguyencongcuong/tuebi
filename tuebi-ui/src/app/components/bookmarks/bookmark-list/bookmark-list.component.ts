import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, of } from 'rxjs';
import { themes } from '../../../enums/theme.enum';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Tag } from '../../../interfaces/tag.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { CategoryEntityService } from '../../../services/category-entity.service';
import { TagEntityService } from '../../../services/tag-entity.service';
import {
  BookmarkListSelectContainerComponent
} from '../bookmark-list-select-container/bookmark-list-select-container.component';
import { BookmarkComponent } from '../bookmark/bookmark.component';
import { FormAddBookmark } from '../form-add-bookmark/form-add-bookmark';

@Component({
  standalone: true,
  imports: [CommonModule, BookmarkComponent, FormAddBookmark, DragDropModule, MatCheckboxModule, FormsModule, BookmarkListSelectContainerComponent],
  selector: 'app-category-detail',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.scss']
})
export class BookmarkListComponent implements OnInit {
  id: string = '';
  bookmarks$: Observable<Bookmark[]> = of([]);
  tags$: Observable<Tag[]> = of([]);
  currentRoute$: Observable<string> = of('');
  filteredBookmarks$: Observable<Bookmark[]> = of([]);
  isEmpty$: Observable<boolean> = of(false);
  
  theme = themes[0];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryEntityService: CategoryEntityService,
    private bookmarkEntityService: BookmarkEntityService,
    private tagEntityService: TagEntityService
  ) {
  }
  
  async ngOnInit() {
    this.currentRoute$ = this.route.paramMap.pipe(map((res: any) => res.params.id));
    this.bookmarks$ = this.bookmarkEntityService.entities$;
    this.tags$ = this.tagEntityService.entities$.pipe(map(tags => tags.map(tag => ({ ...tag, is_selected: false }))))
    
    this.filteredBookmarks$ = combineLatest([this.currentRoute$, this.bookmarks$]).pipe(
      map(([id, bookmarks]) => {
        let filteredBookmarks = [];
        
        if (id === 'trash') {
          filteredBookmarks = bookmarks.filter(bookmark => bookmark.bookmark_deleted);
        } else if (id === 'all') {
          filteredBookmarks = bookmarks.filter(bookmark => !bookmark.bookmark_deleted);
        } else if (id === 'uncategorized') {
          filteredBookmarks = bookmarks.filter(bookmark => !bookmark.category_id && !bookmark.bookmark_deleted);
        } else {
          filteredBookmarks = bookmarks.filter(bookmark => bookmark.category_id === id && !bookmark.bookmark_deleted);
        }
        
        return filteredBookmarks.map(bookmark => ({...bookmark, bookmark_selected: false}));
      })
    );
    
    this.isEmpty$ = this.filteredBookmarks$.pipe(map(bookmarks => !bookmarks.length));
  }
  
}
