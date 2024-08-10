import { NextPageContext } from 'next';
import { Session } from 'next-auth';
import { BuiltInProviderType } from 'next-auth/providers';
import {
	ClientSafeProvider,
	getProviders,
	getSession,
	LiteralUnion,
	signIn,
} from 'next-auth/react';
import Head from 'next/head';

export type LoginProps = {
	provider: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null;
};

const Login = ({ provider }: LoginProps) => {
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
						Sign in with Google
					</button>
				)}
			</main>
		</div>
	);
};

Login.getInitialProps = async (context: NextPageContext) => {
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
