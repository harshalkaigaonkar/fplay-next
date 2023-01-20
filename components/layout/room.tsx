import RoomHeader from 'components/header/room'
import React, { FC, ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { onGetSongsQueue, selectSongsQueue } from 'redux/slice/roomSlice'
import { UseSession } from 'types'

interface RoomLayoutProps {
 session: UseSession,
 room_id: string,
 children: ReactNode,
}

const RoomLayout: FC<RoomLayoutProps> = ({session, children, room_id}) => {

  const songsQueue = useSelector(selectSongsQueue);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetSongsQueue());
  }, [])

  return (
    <div className='lg:mx-20 lg:px-20 lg:flex lg:flex-col min-h-screen md:m-0 md:p-0 select-none animate-enter-opacity'>
      <RoomHeader session={session} room_id={room_id} />
      <main>{children}</main>
    </div>
  )
}

export default RoomLayout