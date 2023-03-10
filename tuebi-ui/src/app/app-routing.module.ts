import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { PageAboutComponent } from 'src/app/components/page-about/page-about.component';
import { PageContactComponent } from 'src/app/components/page-contact/page-contact.component';
import { ROUTE } from './enums/routes.enum';
import { PageHomeComponent } from './components/page-home/page-home.component';

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
	}
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
