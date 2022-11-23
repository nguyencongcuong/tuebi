import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { themes } from 'src/app/contansts/theme';
import { NgIconModule } from 'src/app/ng-icon.module';

@Component({
  selector: 'app-settings-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconModule],
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss']
})
export class SettingsListComponent implements OnInit {
  theme = themes[0];
  
  constructor() { }

  ngOnInit(): void {
  }

}
