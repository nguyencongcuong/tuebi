import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { themes } from '../../enums/theme.enum';
import { Bookmark } from '../../interfaces/bookmark.interface';
import { Category } from '../../interfaces/category.interface';
import { BookmarkEntityService } from '../../services/bookmark-entity.service';
import { CategoryEntityService } from '../../services/category-entity.service';
import { CategoryComponent } from '../../components/category/category.component';
import { FormAddCategory } from '../../components/form-add-category/form-add-category';

@Component({
  selector: 'app-xs-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, CategoryComponent, FormAddCategory, NzDividerModule],
  templateUrl: './page-xs-categories.component.html',
  styleUrls: ['./page-xs-categories.component.scss']
})
export class PageXsCategoriesComponent {
  categories$: Observable<Category[]> = of([]);
  bookmarks$: Observable<Bookmark[]> = of([]);
  
  theme = themes[0];
  
  constructor(
    private categoryEntityService: CategoryEntityService,
    private bookmarkEntityService: BookmarkEntityService,
  ) {
    this.categories$ = this.categoryEntityService.entities$;
    this.bookmarks$ = this.bookmarkEntityService.entities$;
  }
  
  async dropCategory(event: CdkDragDrop<string[]>) {
    const newCategories$ = this.categories$.pipe(
      map((categories) => {
        moveItemInArray(categories, event.previousIndex, event.currentIndex);
        return categories.map((category, i) => ({id: category.id, category_order: i}));
      })
    );
    
    const newCategories = await firstValueFrom(newCategories$);
    
    for (const category of newCategories) {
      this.categoryEntityService.update(category);
    }
  }

}
