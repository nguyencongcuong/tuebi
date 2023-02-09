import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { PageAboutComponent } from 'src/app/pages/page-about/page-about.component';
import { PageContactComponent } from 'src/app/pages/page-contact/page-contact.component';
import { ROUTE } from './enums/routes.enum';
import { PageHomeComponent } from './pages/page-home/page-home.component';

const routes: Routes = [
	{
		path: '',
		component: PageHomeComponent,
	},
	{
		path: ROUTE.CONTACT,
		component: PageContactComponent,
	},
	{
		path: ROUTE.ABOUT,
		component: PageAboutComponent,
	},
	// {
	//   path: "**",
	//   component: Page404Component,
	// },
];

@NgModule({
	exports: [RouterModule],
	imports: [
		RouterModule.forRoot(routes, {
			enableTracing: false,
			onSameUrlNavigation: 'reload',
			paramsInheritanceStrategy: 'always',
			initialNavigation: 'enabledNonBlocking',
		}),
		BrowserModule,
	],
})
export class AppRoutingModule {}
