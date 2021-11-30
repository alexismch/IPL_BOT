import {Configuration} from '@azure/msal-browser';
import {RedirectRequest} from '@azure/msal-browser/dist/request/RedirectRequest';

const getMsalConfig = (): Configuration => {
	return {
		auth: {
			clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID as string,
			authority: 'https://login.microsoftonline.com/f7a15417-57cb-4855-8d36-064f95aada17', //"f7a15417-57cb-4855-8d36-064f95aada17",
			redirectUri: process.env.NEXT_PUBLIC_FRONT_URL,
			postLogoutRedirectUri: process.env.NEXT_PUBLIC_FRONT_URL
		},
		cache: {
			cacheLocation: 'localStorage',
			storeAuthStateInCookie: true,
			secureCookies: true
		}
	};
};

const loginRequest: RedirectRequest = {
	scopes: ['email', 'profile', 'User.Read']
};

export {getMsalConfig, loginRequest};