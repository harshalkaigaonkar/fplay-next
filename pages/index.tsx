import type { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from 'styles/Home.module.css';
import { io, Socket } from 'socket.io-client';
import axios, { Axios } from 'axios';
import {
	APIResponse,
	AuthUserType,
	ClientToServerEvents,
	MongooseUserTypes,
	ServerToClientEvents,
	SocketClientType,
	UseSession,
} from 'types';
// const Text = dynamic(import('components/text'), {ssr:false})
import { getSession, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Layout from 'components/layout';
import Hero from 'components/hero';
import fetchUser from 'helpers/user/fetchUser';
import fetchRoom from 'helpers/room/fetchRoom';
import Room_id from './api/room/get_room/[room_id]';
import { useState } from 'react';
import { NextRouter, useRouter } from 'next/router';

const socket = io(`${process.env.NEXT_PUBLIC_DEV_WS_URL}`);

export type HomeProps = {
	socket?: SocketClientType;
	session?: AuthUserType | any;
	user?: MongooseUserTypes | any;
};

const Home: NextPage<HomeProps> = () => {
	const router: NextRouter = useRouter();
	const { data: session, status }: UseSession = useSession();
	const [alertState, setAlertState] = useState<boolean>(
		router.query.redirect === 'not_available' ? true : false,
	);

	return (
		<div className='m-0 p-0'>
			<Head>
				<title>Fplay🎵</title>
				<meta
					name='description'
					content='Connect and Jam with friends on the go, one song at a time.'
				/>
				<link
					rel='icon'
					href='/favicon.ico'
				/>
			</Head>

			<Layout session={session}>
				{alertState && (
					<div className='w-full flex justify-center my-2'>
						<section className='flex p-4 w-fit items-center gap-2 bg-black/50 rounded-md'>
							<p>Room `{router.query.room_id}` Not Found!!</p>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={2}
								stroke='white'
								className='w-6 h-6 hover:text-black/60 cursor-pointer'
								onClick={() => setAlertState(false)}>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</section>
					</div>
				)}
				<Hero />
			</Layout>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session: Session | null = await getSession(context);

	if (session && session.user) {
		const data = await fetchUser(session.user.email as string);

		if (!data || data.type !== 'Success') {
			return {
				redirect: {
					permanent: false,
					destination: '/login',
				},
			};
		}
		return {
			props: {
				session,
				user: data.data,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
};

export default Home;
