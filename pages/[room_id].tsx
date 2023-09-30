import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import { io, Socket } from "socket.io-client";
import axios, { Axios } from 'axios';
import { APIResponse, AuthUserType, ClientToServerEvents, MongooseRoomTypes, MongooseUserTypes, ServerToClientEvents, SocketClientType, UseSession } from 'types';
import { getSession, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import AudioProvider from 'components/room/audio';
import TrackQueue from 'components/room/queue';
import MusicPanelButton from 'components/track/button';
import UsersConnectedRoom from 'components/room/conections';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import MediaPanel from 'components/panel';
import { useSelector } from 'react-redux';
import { onJoiningRoom, selectRoom, selectRoomInfo } from 'redux/slice/roomSlice';
import { selectPlayer, selectSongsQueue } from 'redux/slice/playerSlice'
import { axiosGet } from 'helpers';
import fetchUser from 'helpers/user/fetchUser';
import fetchRoom from 'helpers/room/fetchRoom';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getSocketSession, selectSocket } from 'redux/slice/socketSlice';
import dynamic from 'next/dynamic';
import {useSocket} from 'hooks/useSocket';
import { updateUser } from 'redux/slice/userSlice';
import RoomLayout from 'components/layout/room';

// const RoomLayout = dynamic(() => import('components/layout/room'), {
//   ssr: false,
// });

export type HomeProps = {
  socket?: SocketClientType,
  session?: AuthUserType|any,
  room: MongooseRoomTypes,
  user: MongooseUserTypes
};


const Home: NextPage<HomeProps> = ({room, user}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {data : session, status}: UseSession = useSession();
  const audioElement = useRef<HTMLAudioElement|null>(null);
  const songsQueue = useSelector(selectSongsQueue);
  const roomInfo = useSelector(selectRoomInfo);
  const player = useSelector(selectPlayer);
  const roomRef = useRef<HTMLDivElement|null>(null);
  const socket = useSocket();

  // useEffect(() => {
  //   const warningText =
  //     'You are currently in a room - are you sure you wish to leave this page?';
  //   // const handleWindowClose = (e: BeforeUnloadEvent) => {
  //   //   e.preventDefault();
  //   //   return (e.returnValue = warningText);
  //   // };
  //   const handleBrowseAway = () => {
  //     if (window.confirm(warningText)) return;
  //     router.events.emit('routeChangeError');
  //   };
  //   // window.addEventListener('beforeunload', handleWindowClose);
  //   router.events.on('routeChangeStart', handleBrowseAway);
    
  //   return () => {
  //     // window.removeEventListener('beforeunload', handleWindowClose);
  //     router.events.off('routeChangeStart', handleBrowseAway);
  //   }
  // }, [router.events]);

  useEffect(() => {
    console.log("user", user)
    if(user)
      dispatch(updateUser(user));
  }, [user])

  useEffect(() => {
    if(user)
      updateUser(user); 
  }, [user])

  
  return (
      <div className='m-0 p-0'>
        <Head>
          <title>Fplay 🎵 | Room - {room?.room_slug.toLowerCase()}</title>
          <meta name="description" content="Connect and Jam with friends on the go, one song at a time." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <RoomLayout session={session} room={room} audioElementRef={audioElement} user={user}>
          <section className='h-[38rem] flex flex-row gap-10'>
            <AudioProvider audioElement={audioElement}  />
            {
              songsQueue.length > 0 && (
                <TrackQueue audioElement={audioElement} />
              )
            }
          </section>
          <div className='w-full h-auto'>
            <UsersConnectedRoom session={session} />
          </div>
        </RoomLayout>
        <MediaPanel audioElement={audioElement} />
      </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Session|null 
    = await getSession(
      context
  );
  
  const { room_id } = context.query;

  if(session&& session.user) {
    const data = await fetchUser(session.user.email as string);
    if(!data || data.type !== "Success")
    {
      return {
        redirect: {
          permanent: false,
          destination: '/login'
        }
      }
    }
    else {
      const roomData = await fetchRoom(room_id as string);
      if(!roomData || roomData.type !== "Success")
      return {
        redirect: {
          permanent: false,
          destination: `/?redirect=not_available&room_id=${room_id}`
        },
      }
      else if (roomData.data && !roomData.data.is_private) 
      {
        await axios.get(`${process.env.NEXTAUTH_URL ?? ""}/api/socket`);
        return {
          props: {
            session,
            room_id,
            room: roomData.data,
            user: data.data
          }
        }
      }
    }
  }

  
  return {
    props: {
      session,
      room_id,
    }
  }
}


export default Home
