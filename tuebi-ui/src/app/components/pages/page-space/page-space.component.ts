import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { SpaceItem } from '../../../interfaces/space.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { BreakpointService } from '../../../services/breakpoint.service';
import { CategoriesEntityService } from '../../../modules/categories/categories.entity.service';
import { AddBookmark } from '../../bookmarks/add-bookmark/add-bookmark';
import { DialogAddBookmarkComponent } from '../../bookmarks/dialog-add-bookmark/dialog-add-bookmark.component';
import { CategoryListComponent } from '../../categories/category-list/category-list.component';
import { ContainerComponent } from '../../commons/container/container.component';
import { IconComponent } from '../../commons/icon/icon.component';
import { SearchComponent } from '../../commons/search/search.component';
import { SettingListComponent } from '../../settings/setting-list/setting-list.component';
import { TagListComponent } from '../../tags/tag-list/tag-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, IconComponent, NzDividerModule, CategoryListComponent, TagListComponent, SettingListComponent, AddBookmark, ContainerComponent, MatListModule, DialogAddBookmarkComponent, SearchComponent],
  selector: 'app-space',
  templateUrl: './page-space.component.html',
  styleUrls: ['./page-space.component.scss']
})
export class PageSpaceComponent implements OnInit {
  public spaceData$: Observable<SpaceItem[]> = of([]);
  public isXs$;
  
  constructor(
    private bookmarkEntityService: BookmarkEntityService,
    private categoryEntityService: CategoriesEntityService,
    private breakpointService: BreakpointService,
  ) {
    this.isXs$ = this.breakpointService.isXs;
  }
  
  async ngOnInit() {
    const bookmarks = await firstValueFrom(this.bookmarkEntityService.entities$);
    
    this.spaceData$ = this.categoryEntityService.entities$.pipe(
      map((categories) => {
        return categories.map((category) => {
          const bookmarksByCategory = bookmarks.filter((bookmark) => bookmark.category_id === category.id);
          return {
            category: category,
            bookmarks: bookmarksByCategory
          };
        });
      })
    );
    
  }
}
