import type { NextPage } from 'next';
import { OAuthProviderType } from 'next-auth/providers';
import Head from 'next/head';
import { useRouter } from 'next/router';

export type ErrorProps = {
	provider?: OAuthProviderType;
};

const Error: NextPage<any> = ({ provider }) => {
	const { query } = useRouter();
	const error = typeof query.error === 'string' ? query.error : null;
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
