import { ArrowLeftIcon, ArrowUpIcon, ArrowUturnLeftIcon, BookmarkIcon, EllipsisVerticalIcon, Square2StackIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import SongPlaying from 'components/icon/playing'
import Image from 'next/image'
import React, { FC, useState } from 'react'
import { HeaderProps } from 'types/header'

const emoji = require('node-emoji')

const RoomHeader: FC<HeaderProps> = ({session,room_id}) => {

    const [playing, setPlaying] = useState(true)
  return (
    <header className='sticky top-0 h-[72px] py-4 flex flex-row justify-between items-center bg-opacity-50 backdrop-blur backdrop-filter border-t-0 border-x-0 border-solid border-[#7A7A7A] z-30' >
        <div className='md:w-80 inline-flex items-center justify-around text-white'>
            <ArrowLeftIcon className='w-14 h-14 p-4 rounded-full transition duration-300 bg-opacity-25 hover:bg-red-600 active:bg-red-500 hover:cursor-pointer hover:-translate-x-1' />
            <Square2StackIcon className='w-14 h-14 p-4 rounded-full transition duration-300 hover:bg-[#434343] active:bg-[#343434] hover:cursor-pointer' />
            <span className='w-20 px-4 py-1 inline-flex gap-3 justify- items-center bg-white/5 rounded-full border-solid border-white/10 hover:cursor-pointer'>
                <ArrowUpIcon className='w-6 h-6' />
                <p>3</p>
            </span>
        </div>
        <div className='inline-flex flex-0 items-center justify-center gap-5'>
            <span className='inline-flex justify-center items-center w-14 h-14 text-2xl p-4'>
                {emoji.get(":fire:")}
            </span>
            <span className='inline-flex flex-col items-center'>
                <h2>
                    Music Room
                </h2>
                <h6 className='font-medium'>
                    {room_id}
                </h6>
            </span>
            <h4 className='px-3 py-2 rounded-full transition duration-500 bg-white text-black'>
                Public
            </h4>
            <span>
                {playing ? <SongPlaying /> : <div />}
            </span>
        </div>
        <div className='w-80 inline-flex items-center justify-around text-white'>
            <EllipsisVerticalIcon className='w-14 h-14 p-4 rounded-full transition duration-300 hover:bg-[#434343] active:bg-[#343434] hover:cursor-pointer' />
            <BookmarkIcon className='w-14 h-14 p-4 rounded-full transition duration-300 hover:bg-[#434343] active:bg-[#343434] hover:cursor-pointer' />
            <span className='inline-flex items-center p-4 rounded-full transition duration-300 hover:bg-[#434343] active:bg-[#343434] hover:cursor-pointer'>
                <Image
                    src={session && session.user.image}
                    alt="Profile"
                    height={25}
                    width={25}
                    className='rounded-full hover:cursor-pointer'
                />
            </span>
        </div>
   </header>  
  )
}

export default RoomHeader