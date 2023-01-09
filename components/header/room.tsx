import { ArrowDownCircleIcon, ArrowUturnLeftIcon, ClipboardDocumentIcon, EllipsisVerticalIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { HeaderProps } from 'types/header'

const emoji = require('node-emoji')

const RoomHeader: React.FC<HeaderProps> = () => {
  return (
    <header className='sticky top-0 h-[72px] mx-20 px-20 py-4 flex flex-row justify-between items-center bg-opacity-50 backdrop-blur backdrop-filter border-bottom' >
        <div className='w-60 inline-flex items-center justify-around text-white'>
            <ArrowUturnLeftIcon className='w-14 h-14 p-4 rounded-full transition duration-150 ease-in-out hover:bg-[#343434] active:bg-[#121212] hover:cursor-pointer' />
            <ClipboardDocumentIcon className='w-14 h-14 p-4 rounded-full transition duration-150 ease-in-out hover:bg-[#343434] active:bg-[#121212] hover:cursor-pointer' />
        </div>
        <div className='inline-flex flex-0 items-center justify-center gap-5'>
            <span className='inline-flex justify-center items-center w-14 h-14 text-2xl p-4'>
                {emoji.get(":fire:")}
            </span>
            <h2>
                Music Room
            </h2>
            <h4 className='px-3 py-2 rounded-full transition duration-150 ease-in-out bg-white text-black'>
                Public
            </h4>
        </div>
        <div className='w-60 inline-flex items-center justify-around text-white'>
            <EllipsisVerticalIcon className='w-14 h-14 p-4 rounded-full transition duration-150 ease-in-out hover:bg-[#343434] active:bg-[#121212] hover:cursor-pointer' />
            <UserCircleIcon className='w-14 h-14 p-4 rounded-full transition duration-150 ease-in-out hover:bg-[#343434] active:bg-[#121212] hover:cursor-pointer' />
        </div>
   </header>  
  )
}

export default RoomHeader