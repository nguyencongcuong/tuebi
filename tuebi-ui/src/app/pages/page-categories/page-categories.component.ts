import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { themes } from '../../enums/theme.enum';
import { Bookmark } from '../../interfaces/bookmark.interface';
import { Category } from '../../interfaces/category.interface';
import { NzZorroModule } from '../../nz-zorro.module';
import { BookmarkEntityService } from '../../services/bookmark-entity.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { CategoryEntityService } from '../../services/category-entity.service';
import { CategoryComponent } from '../../components/category/category.component';
import { FormAddCategory } from '../../components/form-add-category/form-add-category';

@Component({
	standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, CategoryComponent, FormAddCategory, NzZorroModule],
	selector: 'app-category-list',
	templateUrl: './page-categories.component.html',
	styleUrls: ['./page-categories.component.scss']
})
export class PageCategoriesComponent {
	categories$: Observable<Category[]> = of([]);
	bookmarks$: Observable<Bookmark[]> = of([]);
	theme = themes[0];
	
	isXs$;
	
	constructor(
		private categoryEntityService: CategoryEntityService,
		private bookmarkEntityService: BookmarkEntityService,
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
