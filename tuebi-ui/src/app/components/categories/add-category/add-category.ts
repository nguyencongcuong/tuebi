import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '../../commons/button/button.component';
import { IconComponent } from '../../icon/icon.component';
import { DialogAddCategoryComponent } from '../dialog-add-category/dialog-add-category.component';

@Component({
	standalone: true,
	selector: 'app-add-category',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IconComponent,
		MatButtonModule,
		ButtonComponent,
		MatDialogModule
	],
	templateUrl: './add-category.html',
	styleUrls: ['./add-category.scss']
})
export class AddCategory implements OnInit {
	constructor(
		public dialog: MatDialog
	) { }
	
	
	public async ngOnInit() {
	}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(DialogAddCategoryComponent);
		dialogRef.afterClosed().subscribe();
	}
}