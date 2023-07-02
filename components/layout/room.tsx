import RoomHeader from 'components/header/room'
import { useSocket } from 'hooks/useSocket'
import { useRouter } from 'next/router'
import React, { FC, MutableRefObject, ReactNode, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onAddSongIntoQueue, onRemoveSongFromQueue, onRefreshPlayer, onSetupPlayer, selectPlayer, selectSongsQueue, onReaarrangeSongQueue } from 'redux/slice/playerSlice'
import { onChangeUsers, onJoiningRoom, onLeaveUser, selectRoomInfo } from 'redux/slice/roomSlice'
import { MongooseRoomTypes, MongooseUserTypes, UseSession } from 'types'

interface RoomLayoutProps {
 session: UseSession,
 room: MongooseRoomTypes,
 children: ReactNode,
 ref: MutableRefObject<HTMLDivElement|null>,
 user: MongooseUserTypes
}

const RoomLayout: FC<RoomLayoutProps> = ({session, children, room, ref, user}) => {

  const songsQueue = useSelector(selectSongsQueue);
  const dispatch = useDispatch();
  const roomInfo = useSelector(selectRoomInfo);
  const socket = useSocket();
  const player = useSelector(selectPlayer);
  const router = useRouter();
  
  useEffect(() => {
    if(Object.keys(roomInfo).length === 0)
      dispatch(onJoiningRoom(room));
    if(socket){
      socketRoomInitializer();
    }
    return () => {
      socket?.disconnect();
      router?.back();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const socketRoomInitializer = useCallback(async () => {
    socket.emit("connect-to-join-room", {
      user,
      room
    })
    socket.on("leaves-room", (res: any) => {
      if(typeof res === 'string') {
        console.log(`${res} socket_id left the room.`);
        return;
      }
      dispatch(onLeaveUser(res.socket_id));
      // will use for multiple users
      // dispatch(onRefreshPlayer());
      console.log("leaves-room", res)
    })
    socket.on("sync-player-with-redis", (res: any) => {
      const {
        songsQueue,
        currentSongId,
        paused,
        time,
    } = res;

    console.log( "Sync Redis", {
      songsQueue,
      currentSongId,
      paused,
      time
    })
    
    dispatch(onSetupPlayer({
      songsQueue,
      currentSongId,
      paused,
      time
    }));

      console.log("sync-player-with-redis", res)
    })

    socket.on("sync-room-users-with-redis", (res: any) => {

      dispatch(onChangeUsers(res));

      console.log("sync-room-users-with-redis", res)
    })

    socket.on("add-song-in-queue", (song: any) => {
      dispatch(onAddSongIntoQueue([song]))
    })

    socket.on("remove-song-from-queue", (song: any) => {
      console.log("id_to_remove", song)
      try {
        dispatch(onRemoveSongFromQueue(song))
      } catch(err) {
        console.log(err)
      }
    })

    socket.on("replace-song-in-queue", (res: any) => {
      const  {
        replace_from,
        to_replace,
      } = res;
      dispatch(onReaarrangeSongQueue({
        indexReplacedFrom: replace_from, 
        indexReplacedTo: to_replace
      }))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])


  return (
    <div ref={ref} className='lg:mx-20 lg:px-20 lg:flex lg:flex-col min-h-screen md:m-0 md:p-0 select-none animate-enter-opacity'>
      <RoomHeader session={session} room={room} />
      <main>{children}</main>
    </div>
  )
}

export default RoomLayout