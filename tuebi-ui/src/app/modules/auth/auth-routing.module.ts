import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from '../../pages/page-login/page-login.component';
import { PageSignupComponent } from '../../pages/page-signup/page-signup.component';
import { ROUTE } from '../../enums/routes.enum';

const routes: Routes = [
	{
		path: ROUTE.SIGNUP,
		component: PageSignupComponent,
	},
	{
		path: ROUTE.LOGIN,
		component: PageLoginComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
