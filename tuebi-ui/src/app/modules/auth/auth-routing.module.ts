import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormLoginComponent } from '../../components/form-login/form-login.component';
import { FormSignupComponent } from '../../components/form-signup/form-signup.component';
import { ROUTE } from '../../contansts/routes';

const routes: Routes = [
	{
		path: ROUTE.SIGNUP,
		component: FormSignupComponent,
	},
	{
		path: ROUTE.LOGIN,
		component: FormLoginComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
