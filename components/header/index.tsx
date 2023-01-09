import axios from 'axios'
import ProfilePopover from 'components/popover/profile'
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import { UseSession } from 'types'
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import { Popover } from '@headlessui/react'
import PopoverButton from './button/popover'
interface HeaderProps {
 session: UseSession,
 room_id?: string,
}

const Header: FC<HeaderProps> = ({session, room_id}) => {
 
 const onSignOut = async () => {
   signOut()
 }
 const onSignIn = async () => {
   signIn()
 }

 // const handler = async () => {
 //   const {data} = await axios.post('/api/user', {profile:session.data?.user})
 //   console.log(data)
 // }

  return (
   <header className='sticky top-0 h-[72px] mx-20 px-20 py-4 flex flex-row justify-between items-center border-bottom bg-opacity-50 backdrop-blur backdrop-filter' >
      <h4 className='cursor-pointer'>FPLAY ▶️</h4>
      {!session ? (
        <>
            <button className='' onClick={onSignIn}>
              <span>Login</span>
            </button>
        </>
        ): (
            <div className="border-2 h-fit p-[2px] inline-flex items-center rounded-[10px]">
              <PopoverButton session={session} onSignOut={onSignOut} />
            </div>
        )}
   </header>  
  )
}

export default Header