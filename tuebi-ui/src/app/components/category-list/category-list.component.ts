import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { CategoryComponent } from 'src/app/components/category/category.component';
import { FormAddCategory } from 'src/app/components/form-add-category/form-add-category';
import { themes } from 'src/app/contansts/theme';
import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { Category } from 'src/app/modules/categories/categories.model';
import { NzZorroModule } from 'src/app/nz-zorro.module';
import { BookmarksEntityService } from 'src/app/services/bookmarks-entity.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { CategoriesEntityService } from 'src/app/services/categories-entity.service';

@Component({
	standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, CategoryComponent, FormAddCategory, NzZorroModule],
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
	categories$: Observable<Category[]> = of([]);
	bookmarks$: Observable<Bookmark[]> = of([]);
	theme = themes[0];
	
	isXs$;
	
	constructor(
		private categoryEntityService: CategoriesEntityService,
		private bookmarkEntityService: BookmarksEntityService,
		private breakpointService: BreakpointService
	) {
		this.categories$ = this.categoryEntityService.entities$;
		this.bookmarks$ = this.bookmarkEntityService.entities$;
		this.isXs$ = this.breakpointService.isXs;
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
