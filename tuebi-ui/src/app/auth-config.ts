/**
 * This file contains authentication parameters. Contents of this file
 * is roughly the same across other MSAL.js libraries. These parameters
 * are used to initialize Angular and MSAL Angular configurations in
 * in app.module.ts file.
 */

import { BrowserCacheLocation, Configuration, LogLevel } from '@azure/msal-browser';
import { environment } from '../environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: environment.azure_b2c_user_flow_signup_signin,
  },
  authorities: {
    signUpSignIn: {
      authority: `https://${environment.azure_b2c_tenant_name}.b2clogin.com/${environment.azure_b2c_tenant_name}.onmicrosoft.com/${environment.azure_b2c_user_flow_signup_signin}`,
    }
  },
  authorityDomain: `${environment.azure_b2c_tenant_name}.b2clogin.com`
};

export const msalConfig: Configuration = {
  auth: {
    clientId: '4fa212b3-eadb-4c66-bddc-d18eb2bf90a9', // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Defaults to "https://login.microsoftonline.com/common"
    redirectUri: '/', // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
    postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    knownAuthorities: [b2cPolicies.authorityDomain],
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        // console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
}

export const protectedResources = {
  categoriesAPI: {
    endpoint: "http://localhost:3000/api/categories",
    scopes: [`https://${environment.azure_b2c_tenant_name}.onmicrosoft.com/tuebi/categories.read`],
  },
}