import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BookmarkListComponent } from '../../components/bookmarks/bookmark-list/bookmark-list.component';
import { CategoryListComponent } from '../../components/categories/category-list/category-list.component';
import { PageSpaceComponent } from '../../components/page-space/page-space.component';
import { TagDetailsComponent } from '../../components/tags/tag-details/tag-details.component';
import { ROUTE } from '../../enums/routes.enum';
import { AuthGuard } from '../../guards/auth.guard';
import { CategoryResolver } from '../../services/category.resolver';

const routes: Routes = [
	// Large Screen
	{
		path: ROUTE.SPACE,
		component: PageSpaceComponent,
		canActivate: [MsalGuard, AuthGuard],
		resolve: {
			categories: CategoryResolver
		},
		children: [
			{
				path: ROUTE.CATEGORIES,
				component: CategoryListComponent,
			},
			{
				path: `${ROUTE.CATEGORIES}/:id`,
				component: BookmarkListComponent,
			},
			{
				path: `${ROUTE.TAGS}/:id`,
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