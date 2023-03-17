import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  SettingPrivacySecurityDialogComponent
} from '../setting-privacy-security-dialog/setting-privacy-security-dialog.component';

@Component({
  selector: 'app-setting-privacy-security',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule],
  templateUrl: './setting-privacy-security.component.html',
  styleUrls: ['./setting-privacy-security.component.scss']
})
export class SettingPrivacySecurityComponent {
  constructor(
    public dialog: MatDialog,
  ) {
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(SettingPrivacySecurityDialogComponent);
    dialogRef.afterClosed().subscribe()
  }
}
