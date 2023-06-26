import RoomHeader from 'components/header/room'
import { useSocket } from 'hooks/useSocket'
import React, { FC, MutableRefObject, ReactNode, useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onRefreshPlayer, onSetupPlayer, selectPlayer, selectSongsQueue } from 'redux/slice/playerSlice'
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
  const player = useSelector(selectPlayer)
  
  useEffect(() => {
    if(Object.keys(roomInfo).length === 0)
      dispatch(onJoiningRoom(room));
    if(socket){
      socketRoomInitializer();
    }
    return () => {
      socket?.disconnect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      dispatch(onRefreshPlayer());
      console.log("leaves-room", res)
    })
    socket.on("sync-player-with-redis", (res: any) => {
      const {
        songsQueue,
        currentSongId,
        paused,
        time,
    } = res;
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