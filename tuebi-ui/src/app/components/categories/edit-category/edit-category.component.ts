import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Category } from '../../../interfaces/category.interface';
import { IconComponent } from '../../icon/icon.component';
import { DialogEditCategoryComponent } from '../dialog-edit-category/dialog-edit-category.component';

@Component({
	standalone: true,
	selector: 'app-edit-category',
	imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent, MatMenuModule],
	templateUrl: './edit-category.component.html',
	styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent {
	@Input() category = {} as Category;
	
	constructor(
		public dialog: MatDialog,
	) {
	}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(DialogEditCategoryComponent, { data: this.category });
		dialogRef.afterClosed().subscribe()
	}
}
