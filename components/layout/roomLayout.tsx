import Header from 'components/header'
import React, { FC, ReactNode } from 'react'
import { UseSession } from 'types'

interface RoomLayoutProps {
 session: UseSession,
 children: ReactNode
}

const RoomLayout: FC<RoomLayoutProps> = ({session, children}) => {
  return (
    <div className='bg-[#464646] min-h-screen'>
     <Header session={session} />
     <main>{children}</main>
    </div>
  )
}

export default RoomLayout