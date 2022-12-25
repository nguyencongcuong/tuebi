import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PageLoginComponent } from '../../pages/page-login/page-login.component';
import { PageSignupComponent } from '../../pages/page-signup/page-signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthEffects } from './auth.effects';
import { AuthGuard } from './auth.guard';
import { authReducer } from './auth.reducer';
import { AuthService } from './auth.service';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		BrowserModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		FormsModule,
		
		RouterModule.forChild([{path: 'login', component: PageLoginComponent}]),
		StoreModule.forFeature('auth', authReducer),
		EffectsModule.forFeature([AuthEffects]),
		
		PageLoginComponent,
		PageSignupComponent,
		AuthRoutingModule,
	],
	providers: [AuthService, AuthGuard],
})
export class AuthModule {
	static forRoot(): ModuleWithProviders<AuthModule> {
		return {
			ngModule: AuthModule,
			providers: [AuthService],
		};
	}
}
