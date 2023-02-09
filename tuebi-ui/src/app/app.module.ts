import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { registerLocaleData } from '@angular/common';

// Import the Angular HTTP interceptor. 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { isDevMode, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
// Import MSAL and MSAL browser libraries. 
import {
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent
} from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import the Azure AD B2C configuration 
import { msalConfig, protectedResources } from './auth-config';
import { IconComponent } from './components/icon/icon.component';
import { LogoComponent } from './components/logo/logo.component';
import { CategoriesModule } from './modules/categories/categories.module';
import { NzZorroModule } from './nz-zorro.module';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { PageSpaceComponent } from './pages/page-space/page-space.component';
import { metaReducers, reducers } from './reducers';

registerLocaleData(en);

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
  };
}

@NgModule({
	declarations: [AppComponent],
  imports: [
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
    NzZorroModule,
    
    // Initiate the MSAL library with the MSAL configuration object
    MsalModule.forRoot(new PublicClientApplication(msalConfig),
      {
        // The routing guard configuration. 
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: protectedResources.categoriesAPI.scopes
        }
      },
      {
        // MSAL interceptor configuration.
        // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          [protectedResources.categoriesAPI.endpoint, protectedResources.categoriesAPI.scopes]
        ])
      }),
    PageSpaceComponent,
    PageHomeComponent
  ],
	exports: [RouterModule],
	providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard,
    {
      provide: NZ_I18N, 
      useValue: en_US
    }
  ],
	bootstrap: [
    AppComponent,
    MsalRedirectComponent
  ],
})
export class AppModule {}
