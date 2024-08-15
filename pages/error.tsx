import type { NextPage } from 'next';
import { OAuthProviderType } from 'next-auth/providers';
import Head from 'next/head';
import { useMemo } from 'react';

export type ErrorProps = {
	provider?: OAuthProviderType;
};

const Error: NextPage<any> = ({ provider }) => {
	const searchParams = new URLSearchParams();
	const error = useMemo(() => searchParams.get('error'), [searchParams]);
	return (
		<div>
			<Head>
				<title>Fplay | Error</title>
				<meta
					name='description'
					content='Fplay - Connect with Your Friends and Jam, one song at a time.'
				/>
				<link
					rel='icon'
					href='/favicon.ico'
				/>
			</Head>

			<main className='min-h-screen flex justify-center items-center'>
				{!!error && <p>{error}</p>}
			</main>
		</div>
	);
};

export default Error;
