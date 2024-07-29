import type { NextPage } from 'next';
import { Session } from 'next-auth';
import { OAuthProviderType } from 'next-auth/providers';
import { getProviders, getSession, signIn } from 'next-auth/react';
import Head from 'next/head';

export type LoginProps = {
	provider?: OAuthProviderType;
};

const Login: NextPage<any> = ({ provider }) => {
	return (
		<div>
			<Head>
				<title>Fplay | Login</title>
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
				{provider && (
					<button onClick={() => signIn(provider.google.id)}>
						Signin with Google
					</button>
				)}
			</main>
		</div>
	);
};

Login.getInitialProps = async (context) => {
	const { req, res } = context;
	const session: Session | null = await getSession({ req });
	if (session && res && session.user) {
		res.writeHead(302, {
			Location: '/',
		});
		res.end();
		return;
	}
	return {
		provider: await getProviders(),
	};
};

export default Login;
