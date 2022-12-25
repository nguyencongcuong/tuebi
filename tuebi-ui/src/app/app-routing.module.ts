import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { PageAboutComponent } from 'src/app/pages/page-about/page-about.component';
import { PageContactComponent } from 'src/app/pages/page-contact/page-contact.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import {
	PagePasswordResetRequestComponent
} from './pages/page-password-reset-request/page-password-reset-request.component';
import { PageSignupComponent } from './pages/page-signup/page-signup.component';
import { ROUTE } from './enums/routes.enum';

const routes: Routes = [
	{
		path: ROUTE.CONTACT,
		component: PageContactComponent,
	},
	{
		path: ROUTE.LOGIN,
		component: PageLoginComponent,
	},
	{
		path: ROUTE.SIGNUP,
		component: PageSignupComponent,
	},
	{
		path: ROUTE.ABOUT,
		component: PageAboutComponent,
	},
	{
		path: ROUTE.PASSWORD_RESET_REQUEST,
		component: PagePasswordResetRequestComponent,
	}
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
		}),
		BrowserModule,
	],
})
export class AppRoutingModule {}
