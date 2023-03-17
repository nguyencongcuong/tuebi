import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, of } from 'rxjs';
import { themes } from '../../../enums/theme.enum';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { TagEntityService } from '../../../services/tag-entity.service';
import { AddBookmark } from '../../bookmarks/add-bookmark/add-bookmark';
import { BookmarkComponent } from '../../bookmarks/bookmark/bookmark.component';

@Component({
  selector: 'app-tag-details',
  standalone: true,
  imports: [CommonModule, AddBookmark, BookmarkComponent, CdkDrag, CdkDropList],
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent {
  id: string = '';
  bookmarks$: Observable<Bookmark[]> = of([]);
  currentRoute$: Observable<string> = of('');
  filteredBookmarks$: Observable<Bookmark[]> = of([]);
  isEmpty$: Observable<boolean> = of(false);
  
  theme = themes[0];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tagEntityService: TagEntityService,
    private bookmarkEntityService: BookmarkEntityService
  ) {
  }
  
  async ngOnInit() {
    this.currentRoute$ = this.route.paramMap.pipe(map((res: any) => res.params.id));
    this.bookmarks$ = this.bookmarkEntityService.entities$;
    
    this.filteredBookmarks$ = combineLatest([this.currentRoute$, this.bookmarks$]).pipe(
      map(([id, bookmarks]) => {
        return bookmarks.filter(bookmark => bookmark?.bookmark_tags?.includes(id) && !bookmark.bookmark_deleted);
      })
    );
    
    this.isEmpty$ = this.filteredBookmarks$.pipe(map(bookmarks => !bookmarks.length));
  }
}
