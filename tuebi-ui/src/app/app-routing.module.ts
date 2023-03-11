import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { PageHomeComponent } from './components/page-home/page-home.component';
import { PagePrivacyPolicyComponent } from './components/page-privacy-policy/page-privacy-policy.component';

const routes: Routes = [
	{
		path: '',
		component: PageHomeComponent,
	},
	{
		path: 'privacy-policy',
		component: PagePrivacyPolicyComponent
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
