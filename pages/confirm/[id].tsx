import {EventMessage, EventType} from '@azure/msal-browser';
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from '@azure/msal-react';
import {Verification} from '@prisma/client';
import {GetServerSideProps, GetServerSidePropsResult, InferGetServerSidePropsType, NextPage} from 'next';
import Head from 'next/head';
import React, {useEffect} from 'react';
import {loginRequest} from '../../utils/msalConfig';
import prisma from '../../utils/prisma';

const Confirm: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({verification}) => {
	const {instance} = useMsal();

	useEffect(() => {
		const id = instance?.addEventCallback((message: EventMessage) => {
			if (message.eventType === EventType.LOGIN_SUCCESS) {
				console.log('yeah');
			} else {
				console.log(message.eventType);
			}
		});
		console.log('ok');

		return () => {
			if (id) {
				instance.removeEventCallback(id);
			}
		};
	}, [instance]);

	return (
		<>
			<Head>
				<title>Confirm Account - IPL BOT</title>
			</Head>
			<UnauthenticatedTemplate>
				<Unauthenticated/>
			</UnauthenticatedTemplate>
			<AuthenticatedTemplate>
				<Authenticated/>
			</AuthenticatedTemplate>
		</>
	);
};

const Unauthenticated = () => {
	const {instance} = useMsal();

	return (
		<>
			<p>
				Click on the button below in order to complete the verification
			</p>
			<button className="App-button" onClick={() => instance.loginRedirect(loginRequest)}>
				CONFIRM
			</button>
		</>
	);
};

const Authenticated = () => {
	const {instance} = useMsal();

	return (
		<>
			<p>
				Thanks for having complete the verification
			</p>
			<span className="App-title">
				{instance.getActiveAccount()?.name}
			</span>
		</>
	);
};

type ConfirmParams = {
	id: string
}

type ConfirmProps = {
	verification: Verification;
}

export const getServerSideProps: GetServerSideProps<ConfirmProps, ConfirmParams> = async ({params}): Promise<GetServerSidePropsResult<ConfirmProps>> => {
	try {
		const verification = await prisma.verification.findUnique({
			where: {
				id: params?.id
			}
		});

		if (!verification) {
			throw new Error();
		}

		return {
			props: {
				verification: verification as Verification
			}
		};
	} catch (e) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}
};

export default Confirm;
