import Header from 'components/header'
import RoomHeader from 'components/header/room'
import React, { FC, ReactNode } from 'react'
import { UseSession } from 'types'

interface RoomLayoutProps {
 session: UseSession,
 room_id: string,
 children: ReactNode
}

const RoomLayout: FC<RoomLayoutProps> = ({session, children, room_id}) => {
  return (
    <div className='lg:mx-20 lg:px-20 min-h-screen md:m-0 md:p-0'>
     <RoomHeader session={session} room_id={room_id} />
     <main>{children}</main>
    </div>
  )
}

export default RoomLayout