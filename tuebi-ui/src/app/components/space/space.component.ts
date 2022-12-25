import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { ROUTE } from 'src/app/contansts/routes';
import { themes } from 'src/app/contansts/theme';
import { SpaceItem } from 'src/app/interfaces/space';
import { BookmarksEntityService } from 'src/app/services/bookmarks-entity.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { CategoriesEntityService } from 'src/app/services/categories-entity.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, IconComponent],
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {
  ROUTE = ROUTE;
  theme = themes[0];
  
  spaceData$: Observable<SpaceItem[]> = of([]);
  
  isXs$;
  
  constructor(
    private bookmarkEntityService: BookmarksEntityService,
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
