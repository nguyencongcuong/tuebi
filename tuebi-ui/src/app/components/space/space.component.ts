import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { ROUTE } from 'src/app/contansts/routes';
import { themes } from 'src/app/contansts/theme';
import { SpaceItem } from 'src/app/interfaces/space';
import { BookmarksEntityService } from 'src/app/modules/categories/services/bookmarks-entity.service';
import { CategoriesEntityService } from 'src/app/modules/categories/services/categories-entity.service';
import { NgIconModule } from 'src/app/ng-icon.module';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconModule],
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {
  ROUTE = ROUTE;
  theme = themes[0];
  
  spaceData$: Observable<SpaceItem[]> = of([]);
  
  constructor(
    private bookmarkEntityService: BookmarksEntityService,
    private categoryEntityService: CategoriesEntityService,
  ) {
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
