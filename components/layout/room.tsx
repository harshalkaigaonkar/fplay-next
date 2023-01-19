import RoomHeader from 'components/header/room'
import React, { FC, ReactNode } from 'react'
import { UseSession } from 'types'

interface RoomLayoutProps {
 session: UseSession,
 room_id: string,
 children: ReactNode,
 paused?: boolean // removed when to redux
}

const RoomLayout: FC<RoomLayoutProps> = ({session, children, room_id , paused}) => {
  return (
    <div className='lg:mx-20 lg:px-20 lg:flex lg:flex-col min-h-screen md:m-0 md:p-0 select-none animate-enter-opacity'>
      <RoomHeader session={session} room_id={room_id} paused={paused} />
      <main>{children}</main>
    </div>
  )
}

export default RoomLayout