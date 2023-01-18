import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import { io, Socket } from "socket.io-client";
import axios, { Axios } from 'axios';
import { AuthUserType, ClientToServerEvents, ServerToClientEvents, SocketClientType, UseSession } from 'types';
import { getSession, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import RoomLayout from 'components/layout/room';
import AudioProvider from 'components/room/audio';
import TrackQueue from 'components/room/queue';
import MusicPanelButton from 'components/room/music/button';
import UsersConnectedRoom from 'components/room/conections';

const socket = io(`${process.env.NEXT_PUBLIC_DEV_WS_URL}`)

export type HomeProps = {
  socket?: SocketClientType,
  session?: AuthUserType|any,
  room_id: string
};


const Home: NextPage<HomeProps> = ({room_id}) => {

  const {data : session, status}: UseSession = useSession();
  
  return (
    <div className='m-0 p-0'>
      <Head>
        <title>Fplay 🎵 | Room - {room_id}</title>
        <meta name="description" content="Connect and Jam with friends on the go, one song at a time." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;800&display=swap" rel="stylesheet" />
      </Head>

      <RoomLayout session={session} room_id={room_id}>
        <section className='flex flex-row gap-10'>
          <AudioProvider socket={socket} />
          <TrackQueue />
        </section>
        <div className='w-full h-auto'>
          <UsersConnectedRoom session={session} />
        </div>
      </RoomLayout>
      <MusicPanelButton />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Session|null 
    = await getSession(
      context
  );
  
  const { room_id } = context.query;
  
  return {
    props: {
      session,
      room_id
    }
  }
}


export default Home
