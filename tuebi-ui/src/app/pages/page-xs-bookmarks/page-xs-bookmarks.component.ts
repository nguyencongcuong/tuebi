import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBookmarksComponent } from '../page-bookmarks/page-bookmarks.component';

@Component({
  selector: 'app-xs-category-detail',
  standalone: true,
  imports: [CommonModule, PageBookmarksComponent],
  templateUrl: './page-xs-bookmarks.component.html',
  styleUrls: ['./page-xs-bookmarks.component.scss']
})
export class PageXsBookmarksComponent {

}
