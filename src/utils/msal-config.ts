import {Configuration} from 'msal';
import {UserAgentApplication} from 'msal';

const msalConfig: Configuration = {
	auth: {
		clientId: process.env.AZURE_CLIENT_ID as string,
		authority: 'https://login.microsoftonline.com/f7a15417-57cb-4855-8d36-064f95aada17',
		redirectUri: '127.0.0.1',
		postLogoutRedirectUri: '127.0.0.1'
	}
};

const msalInstance = new UserAgentApplication(msalConfig);

export {
	msalInstance
};