import {Configuration} from '@azure/msal-browser';
import {RedirectRequest} from '@azure/msal-browser/dist/request/RedirectRequest';

const getMsalConfig = (): Configuration => {
	let msalConfig: Configuration = {
		auth: {
			clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID as string,
			authority: 'https://login.microsoftonline.com/f7a15417-57cb-4855-8d36-064f95aada17', //"f7a15417-57cb-4855-8d36-064f95aada17",
			redirectUri: 'http://localhost:3000',
			postLogoutRedirectUri: 'https://localhost:3000'
		},
		cache: {
			cacheLocation: 'localStorage',
			storeAuthStateInCookie: true,
			secureCookies: true
		}
	};
	/*if (
		window.location.host === 'localhost:3000' ||
		window.location.host === '127.0.0.1:3000'
	) {
		msalConfig = {
			auth: {
				clientId: '4a6a3699-385f-49a1-9c40-21524dc57eed',
				authority:
					'https://login.microsoftonline.com/f7a15417-57cb-4855-8d36-064f95aada17', //"f7a15417-57cb-4855-8d36-064f95aada17",
				redirectUri: 'http://localhost:3000',
				postLogoutRedirectUri: 'https://localhost:3000'
			},
			cache: {
				cacheLocation: 'sessionStorage', // This configures where your cache will be stored
				storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
			}
		};
	} else {
		msalConfig = {
			auth: {
				clientId: 'e4274dd2-fd73-4756-abac-0faa44362f5b',
				authority:
					'https://login.microsoftonline.com/f7a15417-57cb-4855-8d36-064f95aada17', //"f7a15417-57cb-4855-8d36-064f95aada17",
				redirectUri: 'https://e-vinci.github.io/myjscourse',
				postLogoutRedirectUri:
					'https://e-vinci.github.io/myjscourse'
			},
			cache: {
				cacheLocation: 'sessionStorage', // This configures where your cache will be stored
				storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
			}
		};
	}*/
	return msalConfig;
};

const loginRequest: RedirectRequest = {
	scopes: ['email', 'profile', 'User.Read']
};

export {getMsalConfig, loginRequest};