import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import { io, Socket } from "socket.io-client";
import axios, { Axios } from 'axios';
import { AuthUserType, ClientToServerEvents, ServerToClientEvents, SocketClientType, UseSession } from 'types';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// const Text = dynamic(import('components/text'), {ssr:false})
import Text from 'components/text';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import fetchUser from 'helpers/fetchUser';
import Layout from 'components/layout';

const socket = io(`${process.env.NEXT_PUBLIC_DEV_WS_URL}`)

export type HomeProps = {
  socket?: SocketClientType,
  session?: AuthUserType|any
};


const Home: NextPage<HomeProps> = () => {

  const {data : session, status}: UseSession = useSession();
  
  const onClick = async () => {
    signOut()
  }

  const handler = async () => {
    const {data} = await axios.post('/api/user', {profile:session?.user})
    console.log(data)
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Fplay🎵</title>
        <meta name="description" content="Connect and Jam with friends on the go, one song at a time." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout session={session}>
        Home
      </Layout>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Session|null 
    = await unstable_getServerSession(
        context.req, 
        context.res, 
        authOptions
      );
 
  return {
    props: {
      session
    }
  }
}


export default Home
