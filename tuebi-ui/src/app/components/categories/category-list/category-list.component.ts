import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { Category } from '../../../interfaces/category.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { BreakpointService } from '../../../services/breakpoint.service';
import { CategoriesEntityService } from '../../../modules/categories/categories.entity.service';
import {
	TypographySectionHeaderComponent
} from '../../commons/typography-section-header/typography-section-header.component';
import { AddCategory } from '../add-category/add-category';
import { CategoryComponent } from '../category/category.component';

@Component({
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		DragDropModule,
		CategoryComponent,
		MatDividerModule,
		TypographySectionHeaderComponent,
		AddCategory,
	],
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
	public categories$: Observable<Category[]> = of([]);
	public bookmarks$: Observable<Bookmark[]> = of([]);
	public isXs$;
	
	constructor(
		private categoryEntityService: CategoriesEntityService,
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
