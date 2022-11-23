import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormLoginComponent } from './components/form-login/form-login.component';
import {
	FormPasswordResetRequestComponent
} from './components/form-password-reset-request/form-password-reset-request.component';
import { FormPasswordResetComponent } from './components/form-password-reset/form-password-reset.component';
import { FormSignupComponent } from './components/form-signup/form-signup.component';
import { PageAboutComponent } from './components/page-about/page-about.component';
import { PageContactComponent } from './components/page-contact/page-contact.component';
import { ROUTE } from './contansts/routes';

const routes: Routes = [
	{
		path: ROUTE.CONTACT,
		component: PageContactComponent,
	},
	{
		path: ROUTE.LOGIN,
		component: FormLoginComponent,
	},
	{
		path: ROUTE.SIGNUP,
		component: FormSignupComponent,
	},
	{
		path: ROUTE.ABOUT,
		component: PageAboutComponent,
	},
	{
		path: ROUTE.PASSWORD_RESET_REQUEST,
		component: FormPasswordResetRequestComponent,
	},
	{
		path: ROUTE.PASSWORD_RESET,
		component: FormPasswordResetComponent,
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
		}),
		BrowserModule,
	],
})
export class AppRoutingModule {}
