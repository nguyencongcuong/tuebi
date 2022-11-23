import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookmarksService } from '../categories/services/bookmarks.service';
import { BookmarkSearchItemComponent } from './bookmark-search-item/bookmark-search-item.component';
import { BookmarkSearchComponent } from './bookmark-search/bookmark-search.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchService } from './search.service';

@NgModule({
	declarations: [
		BookmarkSearchComponent,
		BookmarkSearchItemComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SearchRoutingModule
	],
	providers: [SearchService, BookmarksService]
})
export class SearchModule {
}
