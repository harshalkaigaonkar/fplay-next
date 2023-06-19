import RoomHeader from 'components/header/room'
import React, { FC, ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { onGetSongsQueue, selectSongsQueue } from 'redux/slice/playerSlice'
import { MongooseRoomTypes, UseSession } from 'types'

interface RoomLayoutProps {
 session: UseSession,
 room: MongooseRoomTypes,
 children: ReactNode,
}

const RoomLayout: FC<RoomLayoutProps> = ({session, children, room}) => {

  const songsQueue = useSelector(selectSongsQueue);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetSongsQueue());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='lg:mx-20 lg:px-20 lg:flex lg:flex-col min-h-screen md:m-0 md:p-0 select-none animate-enter-opacity'>
      <RoomHeader session={session} room={room} />
      <main>{children}</main>
    </div>
  )
}

export default RoomLayout