import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookmarkSearchComponent } from './bookmark-search/bookmark-search.component';

const routes: Routes = [
	{
		path: 'search',
		component: BookmarkSearchComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SearchRoutingModule {}
