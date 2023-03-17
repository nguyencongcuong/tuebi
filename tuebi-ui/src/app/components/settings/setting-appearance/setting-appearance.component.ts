import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SettingAppearanceDialogComponent } from '../setting-appearance-dialog/setting-appearance-dialog.component';

@Component({
  selector: 'app-setting-appearance',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule],
  templateUrl: './setting-appearance.component.html',
  styleUrls: ['./setting-appearance.component.scss']
})
export class SettingAppearanceComponent {
  constructor(
    public dialog: MatDialog,
  ) {
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(SettingAppearanceDialogComponent);
    dialogRef.afterClosed().subscribe()
  }
}
