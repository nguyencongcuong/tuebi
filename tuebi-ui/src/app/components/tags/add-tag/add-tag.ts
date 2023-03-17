import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '../../commons/button/button.component';
import { IconComponent } from '../../icon/icon.component';
import { DialogAddTagComponent } from '../dialog-add-tag/dialog-add-tag.component';

@Component({
	standalone: true,
	selector: 'app-add-tag',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IconComponent,
		MatButtonModule,
		ButtonComponent,
		MatDialogModule
	],
	templateUrl: './add-tag.html',
	styleUrls: ['./add-tag.scss']
})
export class AddTag implements OnInit {
	constructor(
		public dialog: MatDialog
	) { }
	
	
	public async ngOnInit() {
	}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(DialogAddTagComponent);
		dialogRef.afterClosed().subscribe();
	}
}