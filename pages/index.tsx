import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import { io, Socket } from "socket.io-client";
import axios, { Axios } from 'axios';
import { AuthUserType, ClientToServerEvents, ServerToClientEvents, SocketClientType, UseSession } from 'types';
// const Text = dynamic(import('components/text'), {ssr:false})
import Text from 'components/text';
import { getSession, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Layout from 'components/layout';
import Hero from 'components/hero';

const socket = io(`${process.env.NEXT_PUBLIC_DEV_WS_URL}`)

export type HomeProps = {
  socket?: SocketClientType,
  session?: AuthUserType|any
};


const Home: NextPage<HomeProps> = () => {

  const {data : session, status}: UseSession = useSession();
  
  return (
    <div className='m-0 p-0'>
      <Head>
        <title>Fplay🎵</title>
        <meta name="description" content="Connect and Jam with friends on the go, one song at a time." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout session={session}>
        <Hero />
      </Layout>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Session|null 
    = await getSession(
        context
    );
  return {
    props: {
      session
    }
  }
}


export default Home
