import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Tag } from '../../../interfaces/tag.interface';
import { IconComponent } from '../../icon/icon.component';
import { DialogEditTagComponent } from '../dialog-edit-tag/dialog-edit-tag.component';

@Component({
	standalone: true,
	selector: 'app-edit-tag',
	imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent, NzMenuModule],
	templateUrl: './edit-tag.component.html',
	styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent {
	@Input() tag = {} as Tag;
	
	constructor(
		public dialog: MatDialog,
	) {
	}
	
	openDialog(): void {
		const dialogRef = this.dialog.open(DialogEditTagComponent, { data: this.tag });
		dialogRef.afterClosed().subscribe()
	}
}
