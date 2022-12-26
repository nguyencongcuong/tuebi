import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageBookmarksComponent } from '../../pages/page-bookmarks/page-bookmarks.component';
import { PageCategoriesComponent } from '../../pages/page-categories/page-categories.component';
import { PageSettingsAboutComponent } from '../../pages/page-settings-about/page-settings-about.component';
import {
	PageSettingsAppearanceComponent
} from '../../pages/page-settings-appearance/page-settings-appearance.component';
import {
	PageSettingsGeneralComponent
} from '../../pages/page-settings-general/page-settings-general.component';
import {
	PageSettingsImportExportComponent
} from '../../pages/page-settings-import-export/page-settings-import-export.component';
import {
	PageSettingsPrivacySecurityComponent
} from '../../pages/page-settings-privacy-security/page-settings-privacy-security.component';
import { PageSettingsComponent } from '../../pages/page-settings/page-settings.component';
import { PageXsBookmarksComponent } from '../../pages/page-xs-bookmarks/page-xs-bookmarks.component';
import { PageXsCategoriesComponent } from '../../pages/page-xs-categories/page-xs-categories.component';
import { PageXsSettingsComponent } from '../../pages/page-xs-settings/page-xs-settings.component';
import { ROUTE } from '../../enums/routes.enum';
import { PageSpaceComponent } from '../../pages/page-space/page-space.component';
import { PageXsSpaceComponent } from '../../pages/page-xs-space/page-xs-space.component';
import { CategoryResolver } from '../../services/category.resolver';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
	// Large Screen
	{
		path: ROUTE.SPACE,
		component: PageSpaceComponent,
		canActivate: [AuthGuard],
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
				path: ROUTE.SETTINGS,
				component: PageSettingsComponent,
				children: [
					{
						path: ROUTE.SETTINGS_GENERAL,
						component: PageSettingsGeneralComponent
					},
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
		]
	},
	
	// Small Screen
	{
		path: `m/${ROUTE.SPACE}`,
		component: PageXsSpaceComponent,
		canActivate: [AuthGuard],
		resolve: {
			categories: CategoryResolver
		},
		children: [
			{
				path: ROUTE.CATEGORIES + '/:id',
				component: PageXsBookmarksComponent
			},
			{
				path: ROUTE.CATEGORIES,
				component: PageXsCategoriesComponent
			},
			{
				path: ROUTE.SETTINGS + '/general',
				component: PageSettingsGeneralComponent
			},
			{
				path: ROUTE.SETTINGS + '/appearance',
				component: PageSettingsAppearanceComponent
			},
			{
				path: ROUTE.SETTINGS + '/import-export',
				component: PageSettingsImportExportComponent
			},
			{
				path: ROUTE.SETTINGS + '/about',
				component: PageSettingsAboutComponent
			},
			{
				path: ROUTE.SETTINGS + '/privacy-security',
				component: PageSettingsPrivacySecurityComponent
			},
			{
				path: ROUTE.SETTINGS,
				component: PageXsSettingsComponent
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CategoriesRoutingModule {
}