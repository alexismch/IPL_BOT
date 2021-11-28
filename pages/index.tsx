import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from '@azure/msal-react';
import type {NextPage} from 'next';
import Head from 'next/head';
import React from 'react';

const Home: NextPage = () => {
	const {instance} = useMsal();

	return (
		<>
			<Head>
				<title>Home - IPL BOT</title>
			</Head>
			<p>
				Welcome to IPL BOT
			</p>
			<span className="App-title">
				<UnauthenticatedTemplate>
					STRANGER...
				</UnauthenticatedTemplate>
				<AuthenticatedTemplate>
					{instance.getActiveAccount()?.name}
				</AuthenticatedTemplate>
			</span>
		</>
	);
};

export default Home;
