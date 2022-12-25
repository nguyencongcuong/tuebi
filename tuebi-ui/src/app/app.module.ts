import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconComponent } from './components/icon/icon.component';
import { LogoComponent } from './components/logo/logo.component';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { metaReducers, reducers } from './reducers';
import { ServiceWorkerModule } from '@angular/service-worker';

registerLocaleData(en);

@NgModule({
	declarations: [AppComponent],
  imports: [
    AuthModule.forRoot(),
    
    StoreModule.forRoot(reducers, {
      /*
       * A regular reducer function
       * Run before the other reducers invoked
       */
      metaReducers,
      
      // Setup NgRx Runtime Checks. Each run time check function is actually a meta reducer.
      runtimeChecks: {
        strictStateImmutability: true, // Throw error if mutating the state directly in reducer
        strictActionImmutability: true, // Throw error if mutating the action directly
        strictActionSerializability: true, // Make sure the action serializable
        strictStateSerializability: true, // Make sur the state serializable
      },
    }),
    
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    
    EffectsModule.forRoot([]),
    
    /*
     * This setup track the navigation via Redux Tool / Redux Store
     * Need to import 'router' reducer to ./reducers/index.ts to make this work
     */
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
    }),
    
    EntityDataModule.forRoot({}),
    
    LogoComponent,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    CategoriesModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    IconComponent,
  ],
	exports: [RouterModule],
	providers: [{provide: NZ_I18N, useValue: en_US}],
	bootstrap: [AppComponent],
})
export class AppModule {}
