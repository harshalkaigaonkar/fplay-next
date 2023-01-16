import axios from 'axios'
import ProfilePopover from 'components/popover/profile'
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import { UseSession } from 'types'
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import { Popover } from '@headlessui/react'
import PopoverButton from './button/popover'
import { HeaderProps } from 'types/header'

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
   <header className='sticky top-0 h-[72px] py-4 px-10 flex flex-row justify-between items-center border-x-0 border-t-0 border-solid border-[#7a7a7a] bg-opacity-50 backdrop-blur backdrop-filter z-50' >
      <h4 className='cursor-pointer'>FPLAY ▶️</h4>
      {!session ? (
        <>
            <button 
              className='border-none inline-block rounded bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:scale-110 focus:outline-none focus:ring active:bg-white/30' 
              onClick={onSignIn}
            >
              <p>Login</p>
            </button>
        </>
        ): (
            <div className="border-2 h-fit p-[2px] inline-flex items-center rounded-[10px]">
              <PopoverButton
                session={session} 
                onSignOut={onSignOut} 
              />
            </div>
        )}
   </header>  
  )
}

export default Header