import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { CategoryComponent } from 'src/app/components/category/category.component';
import { FormAddCategory } from 'src/app/components/form-add-category/form-add-category';
import { themes } from 'src/app/contansts/theme';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { Category } from 'src/app/modules/categories/categories.model';
import { BookmarksEntityService } from 'src/app/services/bookmarks-entity.service';
import { CategoriesEntityService } from 'src/app/services/categories-entity.service';

@Component({
  selector: 'app-xs-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, CategoryComponent, FormAddCategory, NzDividerModule],
  templateUrl: './xs-category-list.component.html',
  styleUrls: ['./xs-category-list.component.scss']
})
export class XsCategoryListComponent {
  categories$: Observable<Category[]> = of([]);
  bookmarks$: Observable<Bookmark[]> = of([]);
  
  theme = themes[0];
  
  constructor(
    private categoryEntityService: CategoriesEntityService,
    private bookmarkEntityService: BookmarksEntityService,
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
