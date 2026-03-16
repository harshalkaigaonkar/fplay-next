import { GetServerSideProps } from 'next';
import {
	BuiltInProviderType,
} from 'next-auth/providers';
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

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (session && session.user) {
		return {
			redirect: {
				permanent: false,
				destination: '/',
			},
		};
	}
	return {
		props: {
			provider: await getProviders(),
		},
	};
};

export default Login;
