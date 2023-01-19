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
import MusicPanelButton from 'components/room/track/button';
import UsersConnectedRoom from 'components/room/conections';
import { useState } from 'react';

const socket = io(`${process.env.NEXT_PUBLIC_DEV_WS_URL}`)

export type HomeProps = {
  socket?: SocketClientType,
  session?: AuthUserType|any,
  room_id: string
};


const Home: NextPage<HomeProps> = ({room_id}) => {

  const {data : session, status}: UseSession = useSession();

  const [currentIndex, setCurrentIndex] = useState<number>(0); //to redux
  const [paused, setPaused] = useState<boolean>(false) //to redux

  
  return (
    <div className='m-0 p-0'>
      <Head>
        <title>Fplay 🎵 | Room - {room_id}</title>
        <meta name="description" content="Connect and Jam with friends on the go, one song at a time." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <RoomLayout session={session} room_id={room_id} paused={paused}>
        <section className='flex flex-row gap-10'>
          <AudioProvider socket={socket} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} paused={paused} setPaused={setPaused} />
          <TrackQueue currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}  />
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
