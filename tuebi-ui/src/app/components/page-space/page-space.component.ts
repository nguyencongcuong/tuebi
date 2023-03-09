import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { FormAddBookmark } from '../bookmarks/form-add-bookmark/form-add-bookmark';
import { IconComponent } from '../icon/icon.component';
import { PageSearchComponent } from '../search/page-search/page-search.component';
import { SettingListComponent } from '../settings/setting-list/setting-list.component';
import { TagListComponent } from '../tags/tag-list/tag-list.component';
import { ROUTE } from '../../enums/routes.enum';
import { themes } from '../../enums/theme.enum';
import { SpaceItem } from '../../interfaces/space.interface';
import { BookmarkEntityService } from '../../services/bookmark-entity.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { CategoryEntityService } from '../../services/category-entity.service';
import { CategoryListComponent } from '../categories/category-list/category-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, IconComponent, NzDividerModule, CategoryListComponent, TagListComponent, SettingListComponent, PageSearchComponent, FormAddBookmark],
  selector: 'app-space',
  templateUrl: './page-space.component.html',
  styleUrls: ['./page-space.component.scss']
})
export class PageSpaceComponent implements OnInit {
  ROUTE = ROUTE;
  theme = themes[0];
  
  spaceData$: Observable<SpaceItem[]> = of([]);
  
  isXs$;
  
  constructor(
    private bookmarkEntityService: BookmarkEntityService,
    private categoryEntityService: CategoryEntityService,
    private breakpointService: BreakpointService,
    private msalService: MsalService,
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
  
  logout() {
    this.msalService.logout();
  }
}