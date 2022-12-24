import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryDetailComponent } from 'src/app/components/category-detail/category-detail.component';
import { CategoryListComponent } from 'src/app/components/category-list/category-list.component';
import { SettingsDetailAboutComponent } from 'src/app/components/settings-detail-about/settings-detail-about.component';
import {
	SettingsDetailAppearanceComponent
} from 'src/app/components/settings-detail-appearance/settings-detail-appearance.component';
import {
	SettingsDetailGeneralComponent
} from 'src/app/components/settings-detail-general/settings-detail-general.component';
import {
	SettingsDetailImportExportComponent
} from 'src/app/components/settings-detail-import-export/settings-detail-import-export.component';
import { SettingsListComponent } from 'src/app/components/settings-list/settings-list.component';
import {
	XsCategoryDetailComponent
} from 'src/app/components/small-screens/xs-category-detail/xs-category-detail.component';
import { XsCategoryListComponent } from 'src/app/components/small-screens/xs-category-list/xs-category-list.component';
import { XsSettingListComponent } from 'src/app/components/small-screens/xs-setting-list/xs-setting-list.component';
import { XsSpaceComponent } from 'src/app/components/small-screens/xs-space/xs-space.component';
import { SpaceComponent } from 'src/app/components/space/space.component';
import { ROUTE } from 'src/app/contansts/routes';
import { CategoriesResolver } from 'src/app/services/categories.resolver';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
	// Large Screen
	{
		path: ROUTE.SPACE,
		component: SpaceComponent,
		canActivate: [AuthGuard],
		resolve: {
			categories: CategoriesResolver
		},
		children: [
			{
				path: ROUTE.CATEGORIES,
				component: CategoryListComponent,
				children: [
					{
						path: `:id`,
						component: CategoryDetailComponent
					}
				]
			},
			{
				path: ROUTE.SETTINGS,
				component: SettingsListComponent,
				children: [
					{
						path: ROUTE.SETTINGS_GENERAL,
						component: SettingsDetailGeneralComponent
					},
					{
						path: ROUTE.SETTINGS_APPEARANCE,
						component: SettingsDetailAppearanceComponent
					},
					{
						path: ROUTE.SETTINGS_ABOUT,
						component: SettingsDetailAboutComponent
					},
					{
						path: ROUTE.SETTINGS_IMPORT_EXPORT,
						component: SettingsDetailImportExportComponent
					}
				]
			},
		]
	},
	
	// Small Screen
	{
		path: `m/${ROUTE.SPACE}`,
		component: XsSpaceComponent,
		canActivate: [AuthGuard],
		resolve: {
			categories: CategoriesResolver
		},
		children: [
			{
				path: ROUTE.CATEGORIES + '/:id',
				component: XsCategoryDetailComponent
			},
			{
				path: ROUTE.CATEGORIES,
				component: XsCategoryListComponent
			},
			{
				path: ROUTE.SETTINGS + '/general',
				component: SettingsDetailGeneralComponent
			},
			{
				path: ROUTE.SETTINGS + '/appearance',
				component: SettingsDetailAppearanceComponent
			},
			{
				path: ROUTE.SETTINGS + '/import-export',
				component: SettingsDetailImportExportComponent
			},
			{
				path: ROUTE.SETTINGS + '/about',
				component: SettingsDetailAboutComponent
			},
			{
				path: ROUTE.SETTINGS,
				component: XsSettingListComponent
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