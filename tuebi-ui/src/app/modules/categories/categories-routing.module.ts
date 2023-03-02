import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ROUTE } from '../../enums/routes.enum';
import { AuthGuard } from '../../guards/auth.guard';
import { PageBookmarksComponent } from '../../pages/page-bookmarks/page-bookmarks.component';
import { PageCategoriesComponent } from '../../pages/page-categories/page-categories.component';
import { PageSearchComponent } from '../../pages/page-search/page-search.component';
import { PageSettingsAboutComponent } from '../../pages/page-settings-about/page-settings-about.component';
import {
	PageSettingsAppearanceComponent
} from '../../pages/page-settings-appearance/page-settings-appearance.component';
import {
	PageSettingsImportExportComponent
} from '../../pages/page-settings-import-export/page-settings-import-export.component';
import {
	PageSettingsPrivacySecurityComponent
} from '../../pages/page-settings-privacy-security/page-settings-privacy-security.component';
import { PageSettingsComponent } from '../../pages/page-settings/page-settings.component';
import { PageSpaceComponent } from '../../pages/page-space/page-space.component';
import { PageTagsComponent } from '../../pages/page-tags/page-tags.component';
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
				component: PageCategoriesComponent,
				children: [
					{
						path: `:id`,
						component: PageBookmarksComponent
					}
				]
			},
			{
				path: ROUTE.SEARCH,
				component: PageSearchComponent
			},
			{
				path: ROUTE.TAGS,
				component: PageTagsComponent
			},
			{
				path: ROUTE.SETTINGS,
				component: PageSettingsComponent,
				children: [
					{
						path: ROUTE.SETTINGS_APPEARANCE,
						component: PageSettingsAppearanceComponent
					},
					{
						path: ROUTE.SETTINGS_ABOUT,
						component: PageSettingsAboutComponent
					},
					{
						path: ROUTE.SETTINGS_IMPORT_EXPORT,
						component: PageSettingsImportExportComponent
					},
					{
						path: ROUTE.SETTINGS_PRIVACY_SECURITY,
						component: PageSettingsPrivacySecurityComponent
					}
				]
			},
			{
				path: ROUTE.SETTINGS + '/appearance',
				component: PageSettingsAppearanceComponent
			}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CategoriesRoutingModule {
}