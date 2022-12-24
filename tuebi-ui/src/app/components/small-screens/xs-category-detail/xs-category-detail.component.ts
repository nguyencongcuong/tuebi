import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryDetailComponent } from 'src/app/components/category-detail/category-detail.component';

@Component({
  selector: 'app-xs-category-detail',
  standalone: true,
  imports: [CommonModule, CategoryDetailComponent],
  templateUrl: './xs-category-detail.component.html',
  styleUrls: ['./xs-category-detail.component.scss']
})
export class XsCategoryDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
