import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { PageHomeComponent } from './components/pages/page-home/page-home.component';
import { PagePrivacyPolicyComponent } from './components/pages/page-privacy-policy/page-privacy-policy.component';
import { PageTermsOfServiceComponent } from './components/pages/page-terms-of-service/page-terms-of-service.component';

const routes: Routes = [
	{
		path: '',
		component: PageHomeComponent,
	},
	{
		path: 'privacy-policy',
		component: PagePrivacyPolicyComponent
	},
	{
		path: 'tos',
		component: PageTermsOfServiceComponent,
	},
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
