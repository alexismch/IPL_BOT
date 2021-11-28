import {AuthenticationResult, EventMessage, EventType, PublicClientApplication} from '@azure/msal-browser';
import {MsalProvider} from '@azure/msal-react';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import React, {useEffect} from 'react';
import '../styles/globals.css';
import {getMsalConfig} from '../utils/msalConfig';

const pca = new PublicClientApplication(getMsalConfig());

const MyApp = ({Component, pageProps}: AppProps) => {
	useEffect(() => {
		const id = pca?.addEventCallback((message: EventMessage) => {
			console.log(message);
			if (message.eventType === EventType.LOGIN_SUCCESS) {
				pca.setActiveAccount((message.payload as AuthenticationResult).account);
			}

			console.log(pca.getActiveAccount());
		});

		return () => {
			if (id) {
				pca.removeEventCallback(id);
			}
		};
	}, []);

	return (
		<>
			<Head>
				<title>IPL BOT</title>
				<link rel="shortcut icon" href="/ipl_logo.png"/>
			</Head>
			<MsalProvider instance={pca}>
				<div className="App">
					<Component {...pageProps} />
				</div>
			</MsalProvider>
		</>

	);
};

export default MyApp;
