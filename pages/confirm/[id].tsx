import {AccountInfo} from '@azure/msal-browser';
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from '@azure/msal-react';
import {Verification} from '@prisma/client';
import {GetServerSideProps, GetServerSidePropsResult, InferGetServerSidePropsType, NextPage} from 'next';
import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {loginRequest} from '../../utils/msalConfig';
import prisma from '../../utils/prisma';

const Confirm: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({verification}) => {
	return (
		<>
			<Head>
				<title>Confirm Account - IPL BOT</title>
			</Head>
			<UnauthenticatedTemplate>
				<Unauthenticated/>
			</UnauthenticatedTemplate>
			<AuthenticatedTemplate>
				<Authenticated verification={verification}/>
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

const Authenticated = ({verification}: { verification: Verification }) => {
	const {instance} = useMsal();
	const account = instance.getActiveAccount() as AccountInfo;
	const [message, setMessage] = useState<string>('Verification in process...');

	useEffect(() => {
		fetch(
			`/api/verification/${verification.id}`,
			{
				method: 'PATCH',
				body: JSON.stringify({
					email: account.username,
					name: account.name
				})
			}
		).then(r => {
				if (r.status !== 200) {
					return r.json();
				}
				setMessage('Thanks for having complete the verification');
			}
		).then((body: { message: string } | undefined) => {
				if (!body) {
					return;
				}
				if (!body.message) {
					throw new Error();
				}
				setMessage(body.message);
			}
		).catch((e) => {
			console.log(e);
			setMessage('An error occurred during the verification');
		});
	}, [account.username, account.name, verification.id]);

	return (
		<>
			<p>
				{message}
			</p>
			<span className="App-title">
				{account.name}
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
		const verification = await prisma.verification.findFirst({
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
