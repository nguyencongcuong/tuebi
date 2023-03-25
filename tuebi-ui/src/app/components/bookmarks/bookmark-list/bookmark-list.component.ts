import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, of } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Tag } from '../../../interfaces/tag.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { CategoriesEntityService } from '../../../modules/categories/categories.entity.service';
import { TagEntityService } from '../../../services/tag-entity.service';
import { AddBookmark } from '../add-bookmark/add-bookmark';
import {
  BookmarkListSelectContainerComponent
} from '../bookmark-list-select-container/bookmark-list-select-container.component';
import { BookmarkComponent } from '../bookmark/bookmark.component';

@Component({
  standalone: true,
  imports: [CommonModule, BookmarkComponent, AddBookmark, DragDropModule, MatCheckboxModule, FormsModule, BookmarkListSelectContainerComponent],
  selector: 'app-category-detail',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.scss']
})
export class BookmarkListComponent implements OnInit {
  public id: string = '';
  public bookmarks$: Observable<Bookmark[]> = of([]);
  public tags$: Observable<Tag[]> = of([]);
  public currentRoute$: Observable<string> = of('');
  public filteredBookmarks$: Observable<Bookmark[]> = of([]);
  public isEmpty$: Observable<boolean> = of(false);
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryEntityService: CategoriesEntityService,
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
