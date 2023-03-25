import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BookmarkListComponent } from '../../components/bookmarks/bookmark-list/bookmark-list.component';
import { CategoryListComponent } from '../../components/categories/category-list/category-list.component';
import { PageSpaceComponent } from '../../components/pages/page-space/page-space.component';
import { TagDetailsComponent } from '../../components/tags/tag-details/tag-details.component';
import { AuthGuard } from '../../guards/auth.guard';
import { CategoriesResolver } from './categories.resolver';

const routes: Routes = [
	// Large Screen
	{
		path: 'space',
		component: PageSpaceComponent,
		canActivate: [MsalGuard, () => inject(AuthGuard).canActivate()],
		resolve: {
			categories: CategoriesResolver
		},
		children: [
			{
				path: 'categories',
				component: CategoryListComponent,
			},
			{
				path: `categories/:id`,
				component: BookmarkListComponent,
			},
			{
				path: `tags/:id`,
				component: TagDetailsComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CategoriesRoutingModule {
}