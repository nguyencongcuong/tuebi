import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '../../commons/button/button.component';
import { IconComponent } from '../../icon/icon.component';
import { DialogAddBookmarkComponent } from '../dialog-add-bookmark/dialog-add-bookmark.component';

@Component({
	standalone: true,
	selector: 'app-form-add-bookmark',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IconComponent,
		MatButtonModule,
		ButtonComponent,
		MatDialogModule
	],
	templateUrl: './add-bookmark.html',
	styleUrls: ['./add-bookmark.scss']
})
export class AddBookmark implements OnInit {
	constructor(
		public dialog: MatDialog
	) { }
	
	
	public async ngOnInit() {
	}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(DialogAddBookmarkComponent);
		dialogRef.afterClosed().subscribe();
	}
}